[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Leçons liées : [Leçon 03. Faire du dépôt votre source de vérité unique](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Leçon 04. Répartir les instructions entre plusieurs fichiers](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Fichiers modèles : [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/fr/resources/templates/)

# Projet 02. Rendre le projet lisible et reprendre là où vous vous êtes arrêté

## Ce que vous faites

Ajoutez de la "lisibilité" au dépôt pour qu'un nouvel agent comprenne rapidement la structure du projet, connaisse l'avancement actuel et reprenne le travail. Concrètement : implémentez l'import de documents, la vue de détail et la persistance locale, en deux sessions.

Effectuez deux essais à partir du même code dans `starter/`. Dans le premier, conservez le harness minimal, sans `session-handoff.md`. Dans le second, utilisez le `AGENTS.md` de `solution/` et produisez le fichier de passation à la fin de la session A. Dans les deux cas, la deuxième session reprend le travail de la première. Le protocole garde le code, la consigne, l’agent et le point d’arrêt identiques afin de comparer l’ensemble des règles et de la passation.

## Outils

- Claude Code ou Codex
- Git
- Node.js + Electron
- Éditeur de texte (pour rédiger la documentation)

## Mécanisme de harness

Workspace lisible par l'agent + fichiers d'état persistants

## Utiliser le projet fourni

Chemin dans le dépôt : [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Dossier | Contenu | À comparer |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Code de Project 01 avec import, vue détail et persistance encore incomplets. La documentation existe, mais elle est plus légère et il n'y a pas de `session-handoff.md`. | Combien de contexte une deuxième session doit redécouvrir. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | Même tranche produit terminée, avec documentation de reprise sous [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution), plus [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json) et [`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md). | Sert de référence uniquement : le second essai n’en reprend que `AGENTS.md`, ni le code terminé ni les résultats. |

## Protocole d’exécution

Seul le harness change d’un essai à l’autre. La session A couvre l’importation et la vue de détail ; la session B, la persistance. Consultez le [README du projet](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md).

1. Préparez deux dossiers de travail isolés, par exemple `p02-baseline/` et `p02-improved/`. Terminez les deux sessions d’un essai, archivez les résultats et retirez son dossier avant de lancer l’autre. N’utilisez pas de branches Git pour les séparer : un agent peut lire les autres branches et dossiers voisins, et ainsi voir les fichiers de l’autre essai.
2. Copiez le [même `starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) dans chaque dossier. Il provient de la solution du Projet 01, dont les fonctionnalités passent déjà les vérifications. Dans `feature_list.json`, les trois fonctionnalités du Projet 02 sont à l’état `not-started`. Si vous partez de votre propre Projet 01, copiez le même instantané dans les deux dossiers.
3. Donnez la même consigne à chaque essai : « Implémentez l’import de documents via un sélecteur de fichiers, une vue de détail qui affiche le contenu complet et la persistance des documents après redémarrage de l’application. »
4. Ne copiez ni `solution/docs/`, ni `solution/feature_list.json`, ni `solution/session-handoff.md` : ils décrivent ou valident le travail terminé. Conservez à l’identique au départ `starter/docs/ARCHITECTURE.md`, `starter/docs/PRODUCT.md` et le `feature_list.json` de `starter/`.

### Premier essai (harness minimal)

Dans `p02-baseline/`, gardez le `AGENTS.md` court, `docs/` et `feature_list.json` de départ. Ne supprimez aucun de ces fichiers et n’ajoutez pas `session-handoff.md`.

**Session A:**

1. Lancez l’agent avec la consigne.
2. Arrêtez la session lorsque vous pouvez ouvrir l’application, importer un `.txt` ou un `.md` via le sélecteur, le voir dans la liste et consulter son contenu complet, mais que le document disparaît encore au redémarrage. Appliquez le même critère au second essai.
3. Ne demandez ni note de passation ni autre résumé.

**Session B:**

1. Ouvrez une session d’agent neuve dans le même dossier et dites seulement « Continuez le travail. »
2. Mesurez le temps jusqu’à la première modification significative du code et comptez chaque redécouverte d’une information connue en session A : architecture, commandes ou fonctionnalité en cours.

### Second essai (harness renforcé)

Dans `p02-improved/`, remplacez `AGENTS.md` par [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md) avant la session A. Ne changez rien d’autre au départ. Ce fichier ajoute des règles de démarrage, une hiérarchie documentaire, une règle de mise à jour de la documentation, des preuves de finalisation dans `feature_list.json` et des règles de passation. Cet essai mesure l’ensemble du harness, pas la note de passation à elle seule. Pour isoler son effet, ajoutez un troisième essai avec le `AGENTS.md` du starter et la seule section de passation.

**Session A:**

1. Lancez l’agent avec la même consigne.
2. Arrêtez-vous au même point : importation et vue de détail fonctionnelles, persistance non terminée.
3. Avant de fermer la session, demandez à l’agent d’écrire `session-handoff.md` à la racine du dépôt à partir du [modèle de passation](./../../resources/templates/session-handoff.md) : ce qui a été vérifié, ce qui a changé, ce qui est cassé ou non vérifié et la meilleure prochaine étape. [`solution/session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) décrit une réalisation terminée ; ne le copiez pas.

**Session B:**

1. Ouvrez une session d’agent neuve dans le même dossier et dites seulement « Continuez le travail. » La lecture de `session-handoff.md` est prescrite par `AGENTS.md`, pas par la consigne.
2. Relevez les mêmes mesures que lors du premier essai.

## Comment mesurer les résultats

| Indicateur | Description |
|------|------|
| Temps de reprise en session B | Du début de la session à la première modification significative du code |
| Nombre de redécouvertes | Combien de fois l’agent retrouve une information déjà connue sur l’architecture, les commandes ou l’état |
| Qualité de la passation | Note complète, exacte et exploitable (second essai seulement) |
| Travail répété | Part du travail achevé en A que l’agent refait en B |
| Achèvement final | Les trois fonctionnalités sont-elles terminées ? |

## Quoi remettre

- Journaux ou transcriptions des sessions A et B avec le harness minimal.
- Les mêmes éléments pour le harness renforcé, ainsi que le `AGENTS.md` utilisé et le `session-handoff.md` rédigé par l’agent.
- Une note comparative sur la vitesse de reprise et la qualité de la récupération du contexte.
