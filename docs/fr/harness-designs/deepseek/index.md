# Décryptage de la conception de DeepSeek Harness

[DeepSeek Harness](https://deepseek.com/harness) (commande `dsh`, dépôt `deepseek-ai/deepseek-harness`) est sorti en août 2026 sous la forme d’une Developer Preview. Sa définition officielle va droit au but : **Agent = Model + Environment + Tools + State** — modèle, environnement, outils et état.

Si le décryptage des trois produits précédents demandait « comment concevoir un harness ? », DeepSeek Harness pose une question plus radicale : **un harness peut-il se détacher d’un modèle particulier pour devenir un runtime autonome ?** Sa réponse est oui, et il pousse cette idée jusqu’au bout. Selon les propres termes de la [documentation d’architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) : *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* (chaque partie du produit est un plugin, notamment l’adaptateur de modèle, le registre d’outils, le journal de session et la boucle de l’agent elle-même).

Dans cet article, nous nous concentrons sur trois aspects : le noyau fondé sur les plugins, les capability seams et l’event pipeline, ainsi que sur sa contrainte d’ingénierie la plus forte : « Model-visible means logged ».

## Positionnement en une phrase

Un coding agent traditionnel se compose d’un « LLM + une boucle d’agent fixe + un ensemble d’outils fixe ». DeepSeek Harness associe « un modèle + un noyau de plugins (Cordis) ». Ce noyau ne gère que le chargement et le déchargement des plugins, leurs dépendances et le mécanisme d’événements ; **il ne possède aucune capacité propre à un agent**. Selon les termes de la [documentation d’architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md), « There is no privileged core to patch » (il n’existe aucun noyau privilégié à patcher) et « you extend dsh by mounting a plugin beside the others » (pour étendre dsh, il suffit de monter un plugin aux côtés des autres, sans modifier le noyau). Cela signifie que même la boucle de l’agent n’est pas sacrée : vous pouvez utiliser le modèle de DeepSeek, y connecter les subagents de Claude Code, ajouter une sandbox distante, écrire une mémoire personnalisée, remplacer la boucle ou l’UI, et composer ainsi un agent entièrement nouveau.

C’est l’application la plus radicale de l’idée du cours selon laquelle « tout ce qui se trouve en dehors des poids du modèle relève du harness » : puisque le harness est indépendant, autant en faire un système d’exploitation autonome.

## Cœur de l’architecture 1 : Capability Seam

DeepSeek Harness représente une « capacité » par un Service et décompose presque toutes les capacités en trois couches :

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Prenons le système de fichiers : sous `FS Service` se trouvent plusieurs Providers — Local FS, E2B FS et Remote FS — qui exposent vers le haut une interface uniforme sous forme de file tools. Shell, Subprocess, Sandbox, Web, LLM et SubAgent suivent tous la même structure. Cette architecture à trois couches n’est pas notre interprétation : la section [Capability seams de la documentation d’architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) la définit ainsi : *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* (une capability seam est une capacité remplaçable qui réunit trois rôles : une Service Definition qui déclare l’interface, un Service Provider qui l’implémente et un Consumer qui l’utilise, généralement un outil exposé au modèle).

Cette approche résout une question ancienne de l’ingénierie des harnesses : **un agent doit-il dépendre d’un « outil concret » ou d’une « interface de capacité » ?** DeepSeek Harness choisit la seconde option. Dans le cadre du cours, cela signifie que le « sous-système d’outils » est standardisé sous forme d’interface : remplacer un Provider ne change pas ce que le modèle voit de l’outil, mais transforme entièrement l’environnement.

## Cœur de l’architecture 2 : Event Pipeline

Le fonctionnement interne de DeepSeek Harness n’est pas un simple enchaînement « LLM → outil → LLM », mais un event pipeline dont chaque étape constitue un point d’événement qu’un plugin peut écouter :

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(Le pipeline ci-dessus retranscrit la section [Turn flow de la documentation d’architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) : `turn/*`, `step/*`, `user/message`, `assistant/*` et `tool/*` sont des événements de session persistants ; `agent/pre-step`, `agent/request`, `llm/stream` et `tools/*` sont des points d’extension que les plugins peuvent écouter.)

Le principal avantage de cette conception est que **de nombreuses fonctionnalités ne nécessitent aucune modification de la boucle de l’agent**. Vous voulez effectuer un contrôle de sécurité avant l’exécution d’un outil ? Écoutez `tools/pre-execute`. Ajouter de la mémoire ? Injectez-la dans `agent/pre-step`. Enregistrer le comportement ? Abonnez-vous aux événements de session. Modifier la requête adressée au modèle ? Branchez un hook sur `agent/request`. Décider s’il faut poursuivre le raisonnement ? Écoutez `agent/turn-stopping`.

Par rapport à la Leçon 11, « Intégrer l’observabilité au cœur du harness », DeepSeek Harness va plus loin : il ne se contente pas « d’ajouter des logs », il transforme **chaque étape de la boucle en point d’événement**, ce qui permet à l’observabilité, aux permissions, à la mémoire et aux stratégies de se greffer sur la boucle comme des listeners au lieu d’y être codées en dur.

## Cœur de l’architecture 3 : Session Event Log et « Model-visible means logged »

DeepSeek Harness dispose d’un **Session Event Log append-only** et impose une contrainte d’ingénierie particulièrement forte. La section [Session log de la documentation d’architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) l’énonce ainsi :

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

Autrement dit, l’observabilité n’est pas un log ajouté après coup, mais une contrainte de premier principe du harness : tout élément entrant dans le contexte du modèle doit, par défaut, laisser une trace dans le log. Cela rejoint directement l’idée finale du cours selon laquelle « l’observabilité appartient au harness lui-même » et érige le stockage append-only en principe : les logs sont uniquement ajoutés, jamais écrasés, et l’état de la session peut être rejoué.

## Correspondance avec le cadre du cours

| Sous-système | Implémentation dans DeepSeek Harness | Évaluation |
| --- | --- | --- |
| Instructions | Architecture par plugins ; règles et Skills injectées sous forme de plugins | Très grande liberté, mais aucune convention intégrée de type « CLAUDE.md » |
| Outils | Jonction de capacité Service Definition → Provider → Consumer | Standardisation poussée à l’extrême du sous-système d’outils |
| Environnement | Providers interchangeables pour le sandbox, FS et Shell, y compris E2B à distance | Environnement entièrement interchangeable |
| État | append-only Session Event Log + Model-visible means logged | L’observabilité est une contrainte de premier principe |
| Retour | permission / guard / policy / hook sur tools/pre-execute | Le mécanisme de retour repose sur des événements |

La différence fondamentale entre DeepSeek Harness et les trois autres produits est la suivante : Pi, Claude Code et Codex optimisent tous le harness « à l’intérieur d’un agent particulier » ; DeepSeek Harness, lui, définit le harness comme un **système d’exploitation indépendant du modèle**, l’agent n’étant qu’une application remplaçable exécutée sur cet OS. Le compromis est évident : une plus grande liberté entraîne un coût de configuration plus élevé, revers inhérent à cette conception du « harness comme OS » (la Developer Preview se présente d’ailleurs comme une première expérimentation de mécanismes encore en évolution).

## Conceptions à retenir

1. **Transformer chaque étape de la boucle en point d’événement** : permissions, mémoire, stratégies et logs se greffent sur la boucle comme listeners au lieu d’y être codés en dur.
2. **Standardiser les capability seams** : dépendre d’une « interface de capacité » plutôt que d’un « outil concret » permet de remplacer l’environnement en bloc sans modifier l’interface d’outils visible par le modèle.
3. **Model-visible means logged** : tout ce que le modèle peut voir doit être enregistré, afin de faire de l’observabilité non plus un « bonus », mais une « contrainte de premier principe ».
4. **Journal de session append-only** : un état rejouable et des handoffs fiables garantissent techniquement que « chaque session laisse un état propre ».

## Sources de référence (texte original / code source)

Chaque affirmation peut être reliée aux textes originaux ou au code source ci-dessous, afin d’éviter toute reformulation fondée sur de simples impressions :

- **Site officiel de DeepSeek Harness** : définition du produit « Agent = Model + Environment + Tools + State », positionnement Developer Preview et commande `dsh`.<br/>https://deepseek.com/harness
- **Dépôt deepseek-ai/deepseek-harness** (commande `dsh`, licence MIT) :<br/>https://github.com/deepseek-ai/deepseek-harness
- **Documentation d’architecture architecture.md** : source principale de cet article — « Every part of the product is a plugin », « There is no privileged core to patch », event pipeline Turn flow, trois rôles des Capability seams, « Model-visible means logged » et son runtime invariant, Session Event Log append-only, capability seams fs/tools/telemetry et sous-systèmes `ctx.*`.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Documentation d’architecture · Documents complémentaires** : présentation du noyau Cordis (plugins contribute services, typed events, reversible effects), détail des capability seams et sous-système Session.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Cours associés : [Leçon 11 · Intégrer l’observabilité au cœur du harness](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Leçon 12 · Laisser un état propre à la fin de chaque session](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Leçon 02 · Ce qu’est réellement un harness](../../lectures/lecture-02-what-a-harness-actually-is/)
