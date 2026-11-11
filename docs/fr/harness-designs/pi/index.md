# Décryptage de la conception du harness de Pi

[Pi](https://pi.dev/) (package npm `@earendil-works/pi-coding-agent`) se décrit comme un « minimal agent harness », un harness d’agent minimal. Cette formulation mérite d’être examinée : Pi ne se présente ni comme « le coding agent le plus puissant », ni comme « le meilleur outil de programmation par IA ». Il ancre délibérément son positionnement dans le mot **harness**.

Dans cet article, nous utilisons le cadre des cinq sous-systèmes du cours — instructions, outils, environnement, état et feedback — pour analyser Pi et comprendre ce qui distingue fondamentalement sa philosophie de conception de celles de Claude Code et de Codex. Voici d’emblée la réponse : **la philosophie de Pi consiste à « minimiser le noyau et rendre les extensions programmables ». Il porte l’ingénierie du contexte au-delà du prompt système et laisse l’utilisateur, voire Pi lui-même, modifier le harness, plutôt que de décider du harness à votre place.**

## Positionnement en une phrase

Pi est un noyau minimal : son positionnement officiel réduit volontairement le noyau et vous rend le pouvoir de décision. Selon les termes de la [page d’accueil de pi.dev](https://pi.dev/), « Ask Pi to build what you want, or install a package that does it your way ». Il décompose le harness en quatre couches personnalisables :

- **Extensions** : hooks TypeScript branchés sur les événements du cycle de vie de Pi, formant une surface programmable au niveau du runtime.
- **Skills** : packages de capacités chargés à la demande, qui contiennent instructions et outils selon le principe de progressive disclosure.
- **Prompt templates** : prompts Markdown réutilisables, développés en saisissant `/name`.
- **Themes** : apparence de la TUI.

Cette hiérarchie est déjà en elle-même un choix de conception du harness : **les règles et les extensions déterminent entièrement « ce que le modèle peut voir et à quel moment », au lieu de coder ces décisions en dur dans le noyau.**

## Boucle fondamentale

Comme tous les coding agents, Pi repose essentiellement sur une boucle while « raisonnement → exécution d’un outil → observation → nouveau raisonnement ». Ce qui mérite l’attention n’est pas la boucle elle-même, mais la manière dont Pi traite ce qui l’entoure : il étend la gestion du contexte, d’une simple « compaction » interne à la boucle, à un « contrôle » exercé en amont de celle-ci.

Le runtime de Pi expose une interface programmable. Outre la TUI interactive, la section [Programmatic Usage du README source](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) prend en charge les modes print/JSON scriptables, un protocole RPC et l’intégration via SDK. Un même harness peut donc être piloté étape par étape par un humain ou automatiquement par une CI/CD ou un autre programme. C’est le prérequis du passage « du pilotage manuel à la boucle automatisée » décrit dans la Leçon 13 sur l’ingénierie des boucles : un harness qui ne peut être piloté que de manière interactive par un humain ne pourra jamais entrer dans une boucle automatisée.

## Sous-système d’instructions : AGENTS.md et SYSTEM.md

Pi traite les « instructions » avec retenue, tout en maintenant une hiérarchie claire :

- **AGENTS.md** : la section [Project Context Files du README source](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) précise l’ordre de chargement : `~/.pi/agent/AGENTS.md` global → parcours ascendant des répertoires parents → `./AGENTS.md` du répertoire courant (avec compatibilité CLAUDE.md). C’est l’application du principe « le dépôt est la source de vérité » : les instructions sont des fichiers, pas des rappels glissés dans une conversation.
- **SYSTEM.md** : la [documentation officielle de pi.dev](https://pi.dev/docs/usage/project-context) indique qu’un projet peut remplacer (replace) ou compléter (append) le prompt système par défaut. C’est le seul point d’entrée officiel permettant de modifier le « prompt système » de Pi, ainsi que sa couche « d’auto-description de l’environnement ».

Pi souligne que son prompt système est lui-même **minimal**. Ce choix implique un compromis clair : le noyau n’accumule pas de longues règles du type « si… alors… », mais fournit des points d’extension afin que les règles n’apparaissent sous forme de Skills et d’Extensions que lorsqu’elles sont nécessaires. Cela fait directement écho à la Leçon 04, « Pourquoi un fichier d’instructions géant échoue » : avec un « noyau minimal + des fichiers séparés + un chargement à la demande », Pi évite naturellement le piège du fichier d’instructions géant.

## État et contexte : le domaine où Pi va le plus loin

L’ingénierie du contexte de Pi mérite une attention particulière, car elle traduit en mécanismes concrets des notions du cours telles que la « continuité du contexte » et la « prévention de la corruption du contexte » :

**1. Compaction programmable.** À l’approche de la limite du contexte, les anciens messages sont automatiquement résumés. La [documentation officielle de pi.dev](https://pi.dev/docs/usage/sessions) explique que la stratégie de compaction est elle-même **personnalisable** : une extension peut implémenter une compaction fondée sur les sujets, un résumé sensible au code ou même confier le résumé à un autre modèle. Le README source détaille aussi le mécanisme par défaut : la compaction automatique se déclenche dans deux cas — récupération après dépassement du contexte ou dépassement du seuil de conservation —, le point de coupure conserve environ les 20 000 tokens les plus récents, tandis que les messages antérieurs sont résumés dans un « context handoff » puis compactés progressivement en chaîne. Pi ne considère donc pas la manière de compacter comme une constante figée, mais comme une composante du harness.

**2. Contexte dynamique (Dynamic context).** La [documentation officielle de pi.dev](https://pi.dev/docs/usage/extensions) indique que les extensions peuvent injecter des messages avant chaque étape de raisonnement, filtrer l’historique, mettre en œuvre un RAG et construire une mémoire à long terme. Cela va plus loin que « compacter lorsque le contexte est plein » : vous choisissez ce qui entre ou non dans la fenêtre avant même que le contexte y soit injecté. Pour répondre aux objectifs du cours — « rendre le fonctionnement de l’agent observable et débogable » et « maintenir la continuité du contexte » —, Pi place ces deux responsabilités dans sa surface d’extension.

**3. Arbre de sessions (Session tree).** La [page d’accueil de pi.dev](https://pi.dev/) indique explicitement que « sessions are stored as trees » : `/tree` permet de revenir à n’importe quel nœud historique pour poursuivre le travail, toutes les branches restant enregistrées dans un seul fichier. Cela résout la « rupture du contexte entre sessions » sur laquelle insiste le cours, non pas en raccordant artificiellement des résumés, mais en rejouant un historique structuré. Les branches peuvent être exportées en HTML ou publiées sous forme de gist, ce qui apporte en même temps l’observabilité.

## Sous-système d’outils : Skills et Extensions

Les « outils » de Pi se répartissent en deux couches :

- **Skills** : la section [Skills du README source](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) les définit clairement comme des « self-contained capability packages that the agent loads on-demand » : des packages autonomes de capacités, chargés à la demande, qui contiennent des instructions et des outils et respectent le standard Agent Skills. Grâce à la progressive disclosure, le détail d’un Skill n’entre dans le contexte qu’à son déclenchement, **sans saturer le prompt cache**. Il s’agit d’un choix de conception du harness motivé par les coûts : chaque token supplémentaire dans le contexte est facturé à chaque inférence ; charger les Skills à la demande est une autre manière de « donner la carte, pas le manuel ».
- **Extensions** : des hooks TypeScript branchés sur les événements intégrés du cycle de vie. La section [Hooks du README source](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) donne plusieurs usages officiels : intercepter les commandes dangereuses (barrière de permissions), créer un checkpoint de l’état du code lors d’un changement de tâche, protéger des chemins (interdire l’écriture de `.env`, par exemple), modifier la sortie d’un outil avant de la transmettre au modèle, ou injecter des messages depuis l’extérieur — surveillance de fichiers, Webhook ou CI — pour réveiller l’agent. Les API de ces hooks sont également exportées par `@mariozechner/pi-coding-agent/hooks`. Le harness communautaire [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) enveloppe cette surface de hooks dans des extensions prêtes à l’emploi, telles que skill-router, session-summary, extract-patterns et telemetry.

Les Extensions constituent la décision de conception la plus importante de Pi : **au lieu de proposer seulement quelques interrupteurs, Pi expose toute la surface d’événements interne du runtime.** Vous voulez ajouter de la mémoire ? Injectez-la dans `agent/pre-step`. Enregistrer un comportement ? Abonnez-vous aux événements de session. Modifier une requête adressée au modèle ? Branchez un hook sur `agent/request`. Pi peut ainsi modifier son propre harness, ce qui s’approche davantage de la définition d’un « harness programmable » que n’importe quel ensemble d’options de configuration.

## Feedback et vérification : intégrer aussi « l’apprentissage » au harness

Pi n’intègre pas lui-même de barrière de tests obligatoire — c’est à l’utilisateur d’inscrire les commandes de vérification dans AGENTS.md —, mais le harness communautaire [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) structure la « boucle de feedback » au moyen d’extensions. La section Hooks du README officiel fournit également les fondations de mécanismes similaires :

- **session-summary** (extension de pi-agent-harness) : maintient des entrées glissantes dans `PROGRESS.md` ; il s’agit du sous-système d’état du cours, dédié au suivi de progression des tâches longues.
- **extract-patterns** (extension de pi-agent-harness) : recueille dans la session des enseignements potentiels et les conserve dans `LESSONS.md`, transformant la convention « préparer le handoff avant la fin de chaque session » en mécanisme.
- **telemetry** (extension de pi-agent-harness) : enregistre notamment la consommation de tokens et les coûts, pour assurer l’observabilité.

Le même dépôt communautaire confirme ce modèle : `VISION.md` (objectif), `PROGRESS.md` (progression), `LESSONS.md` (enseignements) et `STANDARDS.md` (standards) sont tous des fichiers Markdown persistants entre les sessions. C’est exactement le schéma recommandé dans le cours — « dépôt comme source de vérité + fichier de progression + mécanisme de handoff » —, simplement transformé en couche prête à l’emploi grâce au mécanisme d’extensions de Pi.

## Correspondance avec le cadre du cours

Évaluation de Pi selon les cinq sous-systèmes du cours (subjective, à titre comparatif) :

| Sous-système | Implémentation dans Pi | Évaluation |
| --- | --- | --- |
| Instructions | Chargement hiérarchique d’AGENTS.md + SYSTEM.md | Hiérarchie claire, mais les règles elles-mêmes doivent être rédigées par l’utilisateur |
| Outils | Chargement des Skills à la demande + hooks couvrant tout le cycle de vie des extensions | Extrêmement puissant : le système d’outils devient une surface programmable |
| Environnement | SYSTEM.md assure l’auto-description de l’environnement ; l’environnement d’exécution doit être déclaré par l’utilisateur dans AGENTS.md | Le mécanisme est ouvert, mais la reproductibilité dépend de la description fournie par l’utilisateur |
| État | Arbre de sessions + compaction personnalisable + PROGRESS.md | Extrêmement puissant : la continuité entre sessions et la reprise sont au cœur du système |
| Retour | Commandes de vérification définies par l’utilisateur ; mécanismes session-summary / extract-patterns | Le mécanisme est fourni, le contenu revient à l’utilisateur |

Le compromis choisi par Pi contraste fortement avec Claude Code et Codex : Claude Code intègre directement au noyau la mémoire, les permissions et les subagents, prêts à l’emploi ; Codex fait des conventions du dépôt et de l’isolation de l’environnement ses valeurs par défaut ; Pi choisit de **ne rien décider à votre place** et transforme le pouvoir de décision en points d’extension. En contrepartie, vous devez soit écrire vos propres extensions, soit installer les packages d’autres développeurs.

## Conceptions à retenir

1. **Rendre la stratégie de compaction interchangeable.** Dans votre harness, « la manière de compacter le contexte » ne devrait pas être un paramètre codé en dur, mais une interface stratégique remplaçable.
2. **Remplacer le résumé forcé par un arbre de sessions.** La reprise entre sessions ne doit pas nécessairement dépendre du « résumé de la session précédente » ; rejouer un historique structuré constitue souvent un sous-système d’état plus fiable.
3. **Préserver le prompt cache.** Charger les Skills à la demande et ne pas injecter toutes les règles d’un coup dans le prompt système relève autant de l’ingénierie du contexte que de l’ingénierie des coûts.
4. **Permettre à l’agent de modifier son propre harness.** Si la surface d’extension du harness est suffisamment ouverte, « optimiser le comportement de l’agent » peut devenir une tâche semi-automatisée par l’agent lui-même.

## Sources de référence (texte original / code source)

Chaque affirmation peut être reliée aux textes originaux ou au code source ci-dessous, afin d’éviter toute reformulation fondée sur de simples impressions :

- **Site officiel de pi.dev** : formulation du positionnement « Ask Pi to build what you want, or install a package that does it your way », quatre couches personnalisables, arbre de sessions (« sessions are stored as trees », `/tree`, enregistrement dans un seul fichier, export HTML et partage par gist).<br/>https://pi.dev/
- **Documentation officielle de pi.dev · Sessions** : compaction interchangeable — topic-based, code-aware ou autre modèle de résumé —, mécanismes de compaction automatique et d’injection dynamique du contexte.<br/>https://pi.dev/docs/usage/sessions
- **Documentation officielle de pi.dev · Extensions** : les extensions peuvent injecter des messages avant chaque étape de raisonnement, filtrer l’historique, effectuer un RAG et construire une mémoire à long terme.<br/>https://pi.dev/docs/usage/extensions
- **Documentation officielle de pi.dev · Project Context** : sémantique replace / append de SYSTEM.md.<br/>https://pi.dev/docs/usage/project-context
- **README du code source de Pi Coding Agent** (badlogic/pi-mono) : ordre de chargement à trois niveaux d’AGENTS.md — global → répertoires parents → répertoire courant —, conditions de déclenchement de `/compact` et de la compaction automatique avec point de coupure à 20 000 tokens, chargement à la demande des Skills et standard Agent Skills, cycle de vie des Hooks et exemples d’usage officiels, Programmatic Usage — JSON / RPC / SDK.<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **Dépôt communautaire pi-agent-harness** : extensions skill-router / session-summary / extract-patterns / telemetry et organisation des fichiers VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md.<br/>https://github.com/LabidySabidy/pi-agent-harness

Cours associés : [Leçon 02 · Ce qu’est réellement un harness](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Leçon 05 · Préserver la continuité du contexte dans les tâches longues](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [Leçon 13 · Passer du pilotage manuel à la boucle automatisée](../../lectures/lecture-13-loop-engineering/)
