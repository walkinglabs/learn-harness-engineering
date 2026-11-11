# Décryptage de la conception du harness de Codex

Le [Codex](https://openai.com/index/harness-engineering/) d’OpenAI est peut-être, parmi les quatre produits, celui qui adhère le plus profondément aux principes fondamentaux du harness. L’article « Harness Engineering », qui a donné son nom à tout le domaine, résume lui-même l’expérience acquise par l’équipe d’OpenAI en construisant un produit avec Codex. Décrypter le harness de Codex revient donc largement à analyser les pratiques d’ingénierie qui sous-tendent cet article.

La philosophie de Codex tient en une phrase : **le dépôt est la source de vérité (repository as the system of record), AGENTS.md n’est qu’une page d’index et la valeur de l’ingénierie réside dans la conception de l’environnement, l’expression de l’intention et la construction de boucles de feedback.**

## Positionnement en une phrase

En quelques semaines, l’équipe d’OpenAI a utilisé Codex pour livrer un produit comptant finalement plus d’un million de lignes de code, **toutes écrites par Codex** — voir la section « Designing for growth » de [Harness Engineering](https://openai.com/index/harness-engineering/). Cette expérience répond à une question : comment organiser un système lorsque le rôle de l’ingénieur passe de « l’écriture du code » à « la conception du harness » ? Codex CLI est lui-même un binaire monolithique open source écrit en Rust ([github.com/openai/codex](https://github.com/openai/codex)), mais sa principale contribution au harness porte sur les **conventions** et **l’ingénierie du contexte**, plutôt que sur des points d’extension sophistiqués.

## Sous-système d’instructions : AGENTS.md est une page d’index, pas une encyclopédie

Voici la contribution la plus influente de Codex à la théorie du harness :

> Un unique fichier d’instructions géant se prête mal aux contrôles mécaniques — couverture, fraîcheur, propriété et liens croisés — et finit inévitablement par s’écarter de la réalité. Nous avons donc cessé de considérer AGENTS.md comme une encyclopédie pour le traiter comme une **page d’index**. Les connaissances du codebase résident dans une documentation structurée, vers laquelle AGENTS.md renvoie.

(Le passage ci-dessus reformule directement la section « AGENTS.md should be a directory page » de l’article [Harness Engineering](https://openai.com/index/harness-engineering/).)

La Leçon 04 explique qu’un « fichier d’instructions géant échoue » ; Codex apporte une réponse directe : limiter AGENTS.md à environ 100 lignes — le texte original recommande approximativement 100 lignes et de déplacer le contenu vers `docs/` à l’approche de cette limite —, puis répartir le reste dans le répertoire `docs/` afin que l’agent le lise à la demande. C’est la source faisant autorité du principe « donner la carte, pas le manuel ».

Le principe associé consiste à **faire respecter les invariants sans micromanager l’implémentation** — dans le texte original : « don't micromanage the implementation；focus on invariants ». AGENTS.md ne doit contenir que les contraintes strictes à ne pas enfreindre et les commandes de vérification ; la manière d’implémenter reste à la discrétion du modèle. Cela correspond directement au principe « contraindre sans micromanager » de la Leçon 02.

## Sous-système de contexte : Write-Select-Compress-Isolate

L’ingénierie du contexte de Codex se résume en quatre stratégies. Ce cadre a été formulé par la communauté lorsque la « context engineering » est devenue une discipline autonome, puis appliqué à Codex — voir [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) :

- **Write (écrire à l’extérieur)** : persister le contexte hors de la fenêtre — conclusions dans la documentation, état dans des fichiers — au lieu de le laisser dans la conversation. C’est le principe du « dépôt comme source de vérité ».
- **Select (sélectionner ce qui entre)** : ne charger dans la fenêtre que les tokens nécessaires — AGENTS.md indique le chemin et les fichiers sont lus à la demande — au lieu d’y injecter tout le dépôt.
- **Compress (compacter)** : ne conserver que ce qui importe réellement. Codex dispose d’une compaction automatique et de la commande manuelle `/compact`, avec personnalisation possible de `compact_prompt` — voir [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/).
- **Isolate (isoler)** : répartir le contexte entre différentes frontières. Les subagents isolent le contexte des tâches ; un subagent frontend, par exemple, ne voit jamais le schema de la base de données du backend.

Codex possède aussi un détail subtil de conception du contexte environnemental. Selon l’analyse du code source [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals), `build_environment_update_item` ne produit que les **champs modifiés** — CWD, branche git et système de fichiers — lorsque l’environnement change, au lieu de recoller l’intégralité du contexte système à chaque tour. C’est un exemple concret de suppression des tokens répétitifs du contexte.

## Outils et frontières : isolation par worktree et subagents

Codex repose sur deux mécanismes fondamentaux de harness :

**1. Isolation de l’environnement par git worktree.** La section « Environment » de [Harness Engineering](https://openai.com/index/harness-engineering/) indique que chaque tâche s’exécute dans un git worktree indépendant, avec une stack d’observabilité locale — logs, métriques et traces —, afin de vérifier chaque changement dans un environnement isolé. C’est la mise en œuvre physique du principe « délimiter clairement chaque tâche de l’agent » de la Leçon 07 : la frontière n’est pas demandée dans une instruction, elle est imposée par l’isolation de l’environnement. Le sous-système d’environnement devient ici une séparation stricte.

**2. Subagents au niveau du noyau.** `spawn_agent` et `wait_agent` sont des outils natifs de Codex : le modèle crée explicitement un subagent, lui attribue un historique de session et un ensemble d’outils indépendants, puis attend son résultat. Le subagent hérite des instructions AGENTS.md de son parent, mais travaille dans **son propre contexte**. Sa configuration dans `.codex/agents/*.toml` peut préciser un modèle et des instructions différents — voir la section Sub-agents de [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/). Il s’agit d’une mise en œuvre directe de « l’isolation du contexte » et de l’esprit du handoff de la Leçon 12 : chaque subagent constitue une unité de travail aux frontières nettes.

## Sous-système de feedback : inscrire les commandes de vérification dans les conventions

La pratique d’OpenAI insiste avant tout sur l’inscription explicite des commandes de vérification dans AGENTS.md, afin que « la manière de confirmer que le travail est correct » fasse partie du dépôt. Dans le processus d’ingénierie de Codex, tests, CI, documentation et configuration de l’observabilité sont tous générés par Codex et constituent tous des « chemins de vérification exécutables ». La réponse à un modèle puissant mais peu fiable n’est pas d’espérer qu’il se discipline de lui-même, mais de faire du **chemin de vérification un composant par défaut du harness**.

Les approval policies et le plan mode apportent un autre type de feedback : produire d’abord un plan et demander une approbation avant d’exécuter une opération à haut risque inscrit les « frontières de la tâche » et le « pouvoir de décision humain » dans le contrôle du runtime.

## Correspondance avec le cadre du cours

| Sous-système | Implémentation dans Codex | Évaluation |
| --- | --- | --- |
| Instructions | AGENTS.md comme page d’index + découpage dans docs/ + invariants d’exécution | Exemplaire : le principe « donner une carte, pas un manuel » y est défini |
| Outils | Isolation par worktree + subagents spawn_agent | Frontières imposées par une forte isolation de l’environnement |
| Environnement | worktree indépendant + stack d’observabilité | L’isolation par worktree est sa marque distinctive |
| État | Stratégie Write (l’état est écrit dans des fichiers ou des documents) | Repose sur des conventions plutôt que sur une mémoire intégrée |
| Retour | Commandes de vérification intégrées aux conventions + approval policies + plan mode | Le parcours de retour est fourni par défaut, un modèle à reprendre |

La comparaison entre Codex et Claude Code est révélatrice : Claude Code procède par « addition », en intégrant au noyau mémoire, permissions et subagents ; Codex procède par « soustraction », en gardant un noyau aussi sobre que possible et en reportant davantage de responsabilités sur les conventions du dépôt et l’ingénierie du contexte. C’est pourquoi la communauté dit souvent que « la philosophie du harness de Codex vaut davantage que son code ».

## Conceptions à retenir

1. **Traiter AGENTS.md comme une page d’index** : le limiter à environ 100 lignes, pointer vers les détails dans docs/ et permettre des contrôles mécaniques.
2. **N’énoncer que les invariants, sans micromanager l’implémentation** : contraintes strictes et commandes de vérification, le reste revenant au modèle.
3. **Isoler l’environnement avec des worktrees** : imposer les frontières des tâches par l’environnement plutôt que les demander dans les instructions.
4. **Ne transmettre que les changements du contexte environnemental** : à chaque tour, ne produire que les champs modifiés, sans répéter tout le contexte système.
5. **Utiliser les subagents pour isoler le contexte** : séparer simultanément tâches et contexte afin que les sous-tâches ne polluent pas la boucle principale.

## Sources de référence (texte original / code source)

Chaque affirmation peut être reliée aux textes originaux ou au code source ci-dessous, afin d’éviter toute reformulation fondée sur de simples impressions :

- **OpenAI « Harness Engineering »** : AGENTS.md comme page d’index et recommandation d’environ 100 lignes, executive invariants / don't micromanage, isolation par worktree avec stack d’observabilité, commandes de vérification intégrées aux conventions, exemple du produit de plus d’un million de lignes, approval policies et plan mode. Source principale de toutes les affirmations essentielles de cet article.<br/>https://openai.com/index/harness-engineering/
- **Spécification officielle d’OpenAI « AGENTS.md »** (AGENTS.md comme convention standard entre outils) :<br/>https://openai.com/index/agents-md/
- **Dépôt open source de Codex CLI** (binaire monolithique écrit en Rust) :<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (communauté) : cadre Write-Select-Compress-Isolate, `/compact` et `compact_prompt`, subagents `spawn_agent` / `wait_agent` et configuration `.codex/agents/*.toml`.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (analyse communautaire du code source) : détails d’implémentation, dont le contexte environnemental incrémental de `build_environment_update_item`.<br/>https://github.com/AlexKenbo/codex-harness-internals

Cours associés : [Leçon 03 · Faire du dépôt la source unique de vérité](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Leçon 04 · Répartir les instructions entre plusieurs fichiers](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [Leçon 07 · Délimiter clairement chaque tâche de l’agent](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
