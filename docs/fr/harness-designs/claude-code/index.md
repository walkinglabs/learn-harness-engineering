# Décryptage de la conception du harness de Claude Code

Dans « [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) », Anthropic affirme clairement que la fiabilité vient du harness, et non du modèle, et que l’agent doit être contraint « en dehors du modèle ». Claude Code est la concrétisation de cette idée, qu’Anthropic classe d’ailleurs directement dans la catégorie des **agentic harnesses**. Il ne s’agit pas d’un argument marketing : Claude Code est peut-être aujourd’hui le harness le plus minutieusement documenté publiquement. Son code source est ouvert, les rapports de recherche communautaires sont détaillés et presque tous les mécanismes fondamentaux du cours — mémoire hiérarchisée, compaction du contexte, permissions, hooks, subagents et persistance des sessions — y sont devenus des fonctionnalités produit complètes.

Dans cet article, nous analysons Claude Code à travers les cinq sous-systèmes du cours, en nous intéressant particulièrement à la manière dont il concrétise les principes fondamentaux du harness : « gestion du contexte », « prévention des déclarations prématurées de réussite » et « contraintes déterministes ».

## Positionnement en une phrase

Le cœur de Claude Code est une simple boucle while : appeler le modèle, exécuter un outil, observer le résultat, puis rappeler le modèle. Mais **l’essentiel du code ne se trouve pas dans cette boucle ; il appartient aux systèmes qui l’entourent** : système de permissions, pipeline de compaction du contexte, mécanismes d’extension, orchestration des subagents et stockage des sessions. Voilà l’essence du harness : la boucle est le squelette, mais tout ce qui l’entoure détermine la fiabilité.

## Sous-système d’instructions : une mémoire hiérarchisée

Le système de mémoire de Claude Code constitue sa contribution la plus directe à la théorie du harness et correspond aux leçons « Faire du dépôt la source unique de vérité » et « Préserver la continuité du contexte entre sessions ». La documentation officielle [How Claude remembers your project](https://code.claude.com/docs/en/memory) précise que chaque session commence avec une fenêtre de contexte entièrement neuve et que les connaissances sont transmises d’une session à l’autre par deux mécanismes : les fichiers CLAUDE.md — vos instructions — et l’auto memory — les notes écrites par Claude.

La documentation distingue quatre portées de fichiers CLAUDE.md, chargées de la plus générale à la plus spécifique :

- **Politique d’organisation** : gérée centralement par l’IT/DevOps, par exemple dans `/etc/claude-code/CLAUDE.md`, pour les standards de l’entreprise.
- **Niveau utilisateur `~/.claude/CLAUDE.md`** : préférences et règles personnelles valables entre projets.
- **Niveau projet `./CLAUDE.md` ou `./.claude/CLAUDE.md`** : source de vérité du projet — structure, stack technique et commandes de vérification — partagée avec le dépôt.
- **Niveau local `./CLAUDE.local.md`** : préférences personnelles propres au projet, généralement ajoutées à `.gitignore` et non commitées.

Deux mécanismes s’y ajoutent :

- **Chargement à la demande au niveau des sous-répertoires** : les CLAUDE.md des sous-répertoires ne sont pas chargés au démarrage, mais entrent dans le contexte lorsque Claude lit un fichier de leur répertoire.
- **Auto memory** : Claude écrit activement des notes à partir de vos corrections et préférences ; elles sont partagées par dépôt, restent valables entre worktrees et sont chargées à hauteur de 200 lignes ou 25KB maximum par session.

Ces quatre portées forment une **hiérarchie d’instructions** : selon la documentation officielle, « les instructions les plus spécifiques entrent plus tard dans le contexte », les instructions du projet apparaissant après celles de l’utilisateur. L’intérêt est de ne pas forcer le modèle à digérer un immense fichier d’instructions au début de chaque conversation, mais de charger l’information au plus près de sa portée. C’est la réponse concrète de Claude Code à la Leçon 04 : « Pourquoi un fichier d’instructions géant échoue ».

## Sous-système de contexte : pipeline de compaction à cinq niveaux

Claude Code gère le contexte au moyen d’un **pipeline de compaction à cinq niveaux** (five-layer compaction pipeline), et non d’un simple « résumé quand la fenêtre est pleine ». Ce détail architectural provient du décryptage du code source publié par VILA Lab, [Dive into Claude Code](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf). Là où la Leçon 05 explique que « les tâches longues perdent leur continuité », Claude Code répond par un entonnoir à plusieurs niveaux : commencer par un élagage sans perte — suppression des résultats d’outils redondants —, poursuivre par une extraction structurée, et ne recourir qu’en dernier lieu à un résumé LLM avec perte, accompagné d’un circuit breaker contre la compaction excessive.

Cette approche est complétée par un **stockage de session orienté ajout (append-oriented storage)** : tout l’historique est ajouté à `history.jsonl`, avec reprise via `/resume` et création de branches par fork. Le handoff est ainsi préparé avant la fin de chaque session, non grâce à une bonne mémoire, mais parce que la couche de stockage est append-only et rejouable.

## Sous-système d’outils : quatre mécanismes d’extension

Claude Code sépare sa surface d’extension en quatre catégories, chacune répondant à un problème distinct. C’est l’une de ses conceptions les plus instructives :

- **Skills** : selon la [documentation officielle](https://code.claude.com/docs/en/skills), un `SKILL.md` décrit un savoir procédural, chargé automatiquement selon des mots déclencheurs et présenté progressivement. Il convient au savoir métier expliquant « comment faire ».
- **MCP** : le protocole JSON-RPC de la [documentation officielle](https://code.claude.com/docs/en/mcp) relie des systèmes externes ; c’est l’interface standard qui permet au modèle d’atteindre le monde extérieur.
- **Hooks** : la [documentation officielle](https://code.claude.com/docs/en/hooks) les définit comme des scripts déterministes attachés à des événements du cycle de vie tels que `PreToolUse`, `PostToolUse` et `Stop`.
- **Plugins / Subagents** : la [documentation officielle](https://code.claude.com/docs/en/sub-agents) confie les tâches complexes à des agents spécialisés.

La conception essentielle est la **séparation des responsabilités** : CLAUDE.md gère « ce qui est », les Skills « comment faire », MCP « à quoi se connecter » et les Hooks « quand imposer une règle ». Mélanger ces couches — par exemple décrire dans CLAUDE.md une tâche qui relève de MCP — provoque la fuite de contexte décrite dans le cours.

## Feedback et vérification : contraintes déterministes et partage humain-machine

La Leçon 10 explique que seule l’exécution du flux complet constitue une véritable vérification. Claude Code y répond par un dispositif à deux voies :

**1. Système de permissions (contraintes déterministes).** Les permissions de Claude Code ne consistent pas à « tout demander ». Elles comprennent sept modes et un classificateur fondé sur le ML : les opérations à faible risque sont autorisées, tandis que les opérations à haut risque sont soumises à la stratégie pour être demandées ou refusées — détails dans le [décryptage de VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf). La délimitation des frontières de l’agent, objet de la Leçon 07, est ainsi imposée par le runtime et non sollicitée dans un prompt.

**2. Hooks (prévenir les déclarations prématurées de réussite).** Un hook `PostToolUse` peut forcer l’exécution de contrôles après un outil et réinjecter les résultats dans le contexte ; un hook `Stop` intervient lorsque l’agent annonce avoir terminé. Cela sépare « celui qui fait » de « celui qui vérifie ». [Anthropic observe explicitement dans son article sur les harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) que les agents « confidently praised their work » ; des hooks injectent donc des contrôles **déterministes**, au lieu de faire confiance à l’auto-évaluation du modèle.

**3. Subagents (isolation du contexte).** L’historique de conversation de chaque subagent est conservé dans un fichier sidechain indépendant et **ne gonfle pas le contexte du parent** — voir le [décryptage de VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf). Les « frontières de tâche » sont ainsi associées à « l’isolation du contexte » : le découpage du travail isole aussi la pollution contextuelle.

## Observabilité et persistance des sessions

Les logs complets de Claude Code sont append-only (history.jsonl). Avec les commandes explicites `/compact`, `/clear` et `/init`, vous pouvez gérer activement l’état du contexte au lieu d’attendre passivement qu’il soit plein. `/init` transforme même en commande l’initialisation préalable de l’agent décrite dans la Leçon 06 : selon la [documentation officielle](https://code.claude.com/docs/en/memory), elle analyse automatiquement le codebase et génère un CLAUDE.md initial contenant commandes de build, instructions de test et conventions d’ingénierie.

## Correspondance avec le cadre du cours

| Sous-système | Implémentation dans Claude Code | Évaluation |
| --- | --- | --- |
| Instructions | Hiérarchisation par portée (organisation/utilisateur/projet/local) + mémoire automatique | La mémoire hiérarchisée constitue une implémentation de référence |
| Outils | Quatre types d’extensions : Skills + MCP + hooks + subagents | La séparation claire des responsabilités est un atout majeur |
| Environnement | Paramètres du projet + settings.json | L’utilisateur doit le décrire lui-même dans CLAUDE.md |
| État | Stockage append-only des sessions + compaction à cinq niveaux + resume/fork | Extrêmement puissant, une implémentation de référence pour la continuité des tâches longues |
| Retour | Classificateur de permissions + contrôle imposé par le hook PostToolUse | Transforme la prévention des annonces prématurées de réussite en mécanisme déterministe |

## Conceptions à retenir

1. **Hiérarchiser les instructions par portée** au lieu de les entasser dans un fichier. Le CLAUDE.md au niveau du répertoire est une élégante mise en œuvre du « chargement au plus près ».
2. **Faire de la compaction un entonnoir progressif** : sans perte avant avec perte, sans commencer par résumer tout le contenu.
3. **Utiliser les hooks pour les contrôles déterministes** : empêcher les déclarations prématurées de réussite exige une contrainte du runtime, pas une supplique dans le prompt.
4. **Isoler le contexte des subagents** : découper à la fois les tâches et leur contexte pour ne pas polluer la boucle principale avec les résultats des sous-tâches.
5. **Adopter un stockage de session append-only et rejouable** : le handoff est garanti par la couche de stockage, pas par la mémoire.

## Sources de référence (texte original / code source)

Chaque affirmation peut être reliée aux textes originaux ou au code source ci-dessous, afin d’éviter toute reformulation fondée sur de simples impressions :

- **Documentation officielle de Claude Code · Memory** : nouveau contexte à chaque session, quatre portées de CLAUDE.md, chargement à la demande des sous-répertoires, auto memory — 200 lignes / 25KB — et génération de CLAUDE.md par `/init`.<br/>https://code.claude.com/docs/en/memory
- **Documentation officielle de Claude Code · Skills / MCP / Hooks / Sub-agents** : définition des quatre mécanismes d’extension et événements PreToolUse / PostToolUse / Stop.<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab « Dive into Claude Code »** (rapport d’analyse au niveau du code source) : pipeline de compaction à cinq niveaux, sept modes de permissions avec classificateur ML, subagents sidechain et stockage de session append-only dans history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic « Effective harnesses for long-running agents »** : origine des idées selon lesquelles « la fiabilité vient du harness, et non du modèle », les agents vantent leur travail avec assurance et les hooks doivent assurer la vérification.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Guide de lecture de Claude Code Full Stack** (communauté, hiérarchisation de CLAUDE.md / Skills / MCP / Subagents / Hooks) : lecture complémentaire sur la séparation des responsabilités entre mécanismes d’extension.<br/>https://jsmanifest.com/claude-code-full-stack-guide

Cours associés : [Leçon 03 · Faire du dépôt la source unique de vérité](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Leçon 09 · Empêcher l’agent d’annoncer prématurément sa réussite](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [Leçon 10 · Seul le flux complet constitue une véritable vérification](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
