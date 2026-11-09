# Bibliothèque de ressources en français

Ce dossier transforme les méthodes du cours en modèles prêts à copier et en références compactes utilisables dans un vrai dépôt.

## Quand l'utiliser

Commencez ici lorsque vous voulez que Codex, Claude Code ou un autre agent de codage travaille sur plusieurs sessions sans redécouvrir en permanence le setup, l'état et le scope.

C'est particulièrement utile lorsque :

- le travail s'étend sur plusieurs sessions
- les fonctionnalités sont nombreuses et faciles à laisser à moitié terminées
- les agents ont tendance à déclarer la victoire trop tôt
- les étapes de démarrage sont redécouvertes à chaque fois

## Commencer ici

Pour une configuration minimale, commencez avec :

- instructions racine : [`templates/AGENTS.md`](./templates/AGENTS.md) ou [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- état des fonctionnalités : [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- journal de progression : [`templates/claude-progress.md`](./templates/claude-progress.md)
- référence du script de bootstrap : `docs/fr/resources/templates/init.sh`

Ajoutez ensuite :

- handoff de session : [`templates/session-handoff.md`](./templates/session-handoff.md)
- checklist de sortie propre : [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- grille d'évaluation : [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

Si vous voulez une structure de dépôt plus complète, proche de l'article OpenAI "Harness engineering", utilisez le pack avancé :

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Structure de la bibliothèque

- [`templates/`](./templates/index.md) : modèles à copier dans un vrai dépôt
- [`reference/`](./reference/index.md) : notes de méthode, flux de démarrage et cartes des modes de défaillance
- [`openai-advanced/`](./openai-advanced/index.md) : squelette de dépôt avancé, documents system-of-record et modèles de gouvernance agent-first

## Pack minimal recommandé

- `AGENTS.md` ou `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Ces quatre fichiers suffisent à rendre la plupart des workflows d'agents nettement plus stables.

Lorsque le dépôt devient un système durable avec plusieurs domaines, des plans actifs, une notation qualité et des politiques de fiabilité, passez au pack [`openai-advanced/`](./openai-advanced/index.md) au lieu d'étirer trop loin le pack minimal.
