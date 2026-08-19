<p align="center">
  <a href="../../README.md"><img alt="English" src="https://img.shields.io/badge/EN-English-blue?style=flat-square"></a>
  <a href="../zh-CN/README.md"><img alt="简体中文" src="https://img.shields.io/badge/ZH-简体中文-red?style=flat-square"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文" src="https://img.shields.io/badge/ZH--TW-繁體中文-orange?style=flat-square"></a>
  <a href="../ja-JP/README.md"><img alt="日本語" src="https://img.shields.io/badge/JA-日本語-green?style=flat-square"></a>
  <a href="../ko-KR/README.md"><img alt="한국어" src="https://img.shields.io/badge/KO-한국어-blueviolet?style=flat-square"></a>
  <a href="../es-ES/README.md"><img alt="Español" src="https://img.shields.io/badge/ES-Español-yellow?style=flat-square"></a>
  <a href="../fr-FR/README.md"><img alt="Français" src="https://img.shields.io/badge/FR-Français-007EC6?style=flat-square"></a>
  <a href="../ru-RU/README.md"><img alt="Русский" src="https://img.shields.io/badge/RU-Русский-informational?style=flat-square"></a>
  <a href="../de-DE/README.md"><img alt="Deutsch" src="https://img.shields.io/badge/DE-Deutsch-2EA043?style=flat-square"></a>
  <a href="../ar-SA/README.md"><img alt="العربية" src="https://img.shields.io/badge/AR-العربية-success?style=flat-square"></a>
  <a href="../vi-VN/README.md"><img alt="Tiếng Việt" src="https://img.shields.io/badge/VI-Tiếng_Việt-cc6699?style=flat-square"></a>
  <a href="../uz-UZ/README.md"><img alt="Oʻzbekcha" src="https://img.shields.io/badge/UZ-Oʻzbekcha-1A8BBA?style=flat-square"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe" src="https://img.shields.io/badge/TR-Türkçe-E30A17?style=flat-square"></a>
  <a href="../pt-BR/README.md"><img alt="Português-BR" src="https://img.shields.io/badge/PT--BR-Português-1A8BBA?style=flat-square"></a>
  <a href="../uk-UA/README.md"><img alt="Українська" src="https://img.shields.io/badge/UK-Українська-0057B7?style=flat-square"></a>
</p>

# Learn Harness Engineering

> **Un cours basé sur des projets consacré à la construction de l'environnement, de la gestion d'état, de la vérification et des mécanismes de contrôle qui permettent aux agents de codage IA de fonctionner de manière fiable.**

Learn Harness Engineering est un cours dédié à l'ingénierie des agents de codage IA. Nous avons étudié et synthétisé en profondeur les théories et pratiques les plus avancées en matière de Harness Engineering dans l'industrie. Nos références principales incluent :

> **🆕 Mise à jour d'août 2026 : Décryptages de la conception des harnesses de pointe** — une nouvelle section avec 4 décryptages :
>
> - **Nouvelle section** [Décryptages de la conception des harnesses de pointe](../../docs/fr/harness-designs/index.md) — appliquez le cadre à cinq sous-systèmes du cours (instructions, outils, environnement, état, feedback) pour rétroconcevoir la manière dont quatre produits de pointe construisent de véritables harnesses.
> - **Pi** [Comment Pi construit son harness](../../docs/fr/harness-designs/pi/index.md) — un noyau minimal, une extension programmable et l'ingénierie du contexte derrière « demandez à Pi de construire ce que vous voulez ».
> - **Claude Code** [Comment Claude Code construit son harness](../../docs/fr/harness-designs/claude-code/index.md) — une mémoire à quatre couches, une compaction à cinq niveaux, des hooks et l'isolation des sous-agents.
> - **Codex** [Comment Codex construit son harness](../../docs/fr/harness-designs/codex/index.md) — le dépôt comme source de vérité, AGENTS.md comme page de répertoire et l'isolation par worktree.
> - **DeepSeek** [Comment DeepSeek construit son harness](../../docs/fr/harness-designs/deepseek/index.md) — « tout est un plugin », les frontières de capacités et un pipeline d'événements.
> - **Les 15 langues** — une couverture de traduction complète dans toutes les langues prises en charge.
>
> **Idée centrale :** Le cours vous fournit un cadre ; ces décryptages vous montrent comment les mêmes principes se concrétisent dans des harnesses de production.
>
> **🆕 Mise à jour d'août 2026 : Ingénierie des graphes (Graph Engineering)** — 1 nouveau cours + 1 nouveau projet :
>
> - **Cours 14** [Des boucles simples à l'ingénierie des graphes](../../docs/fr/lectures/lecture-14-graph-engineering/index.md) : pourquoi une boucle unique devient naturellement un graphe — la pile à quatre couches (prompt → context → loop → graph) et la place du harness dans celle-ci, les quatre composants d'un graphe (nœuds, arêtes, état partagé, routage), pourquoi les points de contrôle dans un loop ne sauvent pas les trois échecs structurels qui surviennent à l'échelle (Goodhart, cécité vers le haut, conflit), les six étapes indépendantes de tout framework pour construire votre premier graphe, la différence entre Graph et Workflow, les ancres, l'état des projets open source avant vs après la publication, la taxe d'orchestration, et le moment où il vaut réellement la peine de dessiner un graphe.
> - **Projet 08** [Dessinez votre workflow sous forme de graphe](../../docs/fr/projects/project-08-graph-engineering-first-graph/index.md) : trois expériences progressives — dessiner le loop maker-checker comme un graphe explicite, ajouter un nœud de fan-out/fan-in parallèle, ajouter une arête de retour arrière conditionnelle et un nœud d'approbation humaine.
>
> **Idée centrale :** Un loop est un graphe à un seul nœud. Quand une tâche exige la spécialisation, le parallélisme, l'état partagé, la vérification et la récupération — ce n'est plus un loop, c'est un graphe.
>
> **🆕 Mise à jour de juillet 2026 : Ingénierie des boucles (Loop Engineering)** — 1 nouveau cours + 1 nouveau projet + des modèles de code :
>
> - **Cours 13** [Pourquoi vous devez arrêter de faire du prompting à vos agents vous-même](../../docs/fr/lectures/lecture-13-loop-engineering/index.md) : de `/goal` aux six primitives de l'ingénierie des boucles (automations, worktrees, skills, connecteurs, sous-agents, état externe), la séparation générateur/évaluateur, quatre coûts silencieux, et la construction progressive de votre première boucle.
> - **Projet 07** [Construisez votre première boucle automatisée](../../docs/fr/projects/project-07-loop-engineering-first-loop/index.md) : trois expériences progressives — boucle par but, boucle temporelle, boucle maker-checker. Comparer manuel vs. automatisé, mesurer la réduction des interventions, apprendre à sortir de la boucle.
> - **Modèles de code** : `goal-template.md`, `loop-state-template.md`, `maker-prompt.md`, `checker-prompt.md` — des modèles de construction de boucles prêts à l'emploi.
>
> **Idée centrale :** Le Harness Engineering construit la voiture. L'ingénierie des boucles conçoit la route sur laquelle elle roule — et vous concevez cette route depuis l'extérieur de la voiture.

- [OpenAI : Harness engineering : leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic : Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic : Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Démarrage rapide ?** Le skill [`skills/harness-creator/`](../../skills/harness-creator/) peut vous aider à générer un harness de niveau production (AGENTS.md, listes de fonctionnalités, init.sh, flux de vérification) pour votre propre projet en quelques minutes.

---

## Table des Matières

- [Aperçu Visuel](#aperçu-visuel)
- [Ce que signifie réellement Harness Engineering](#ce-que-signifie-réellement-harness-engineering)
- [Démarrage Rapide : Améliorez votre agent dès aujourd'hui](#démarrage-rapide-améliorez-votre-agent-dès-aujourd-hui)
- [Projet Final : Une véritable application](#projet-final-une-véritable-application)
- [Parcours d'Apprentissage](#parcours-d-apprentissage)
- [Programme d'Études](#programme-d-études)
- [Skills](#skills)
- [Autres Cours](#autres-cours)

---

## Aperçu Visuel

### Page d'Accueil du Cours
> Un plan de cours complet et une introduction aux philosophies fondamentales, offrant un chemin clair pour commencer.

![Aperçu de la page d'accueil du cours](../../docs/public/screenshots/readme/zh-home.png)

### Cours Immersifs
> Des plongées approfondies dans les problèmes concrets et des projets pratiques (comme le Projet 01) pour une expérience d'apprentissage immersive.

![Aperçu des cours](../../docs/public/screenshots/readme/zh-lecture-01.png)

### Bibliothèque de Ressources Prête à l'Emploi
> Des modèles et des configurations de référence conçus pour résoudre les problèmes courants dans le développement d'agents IA multi-tours, tels que la perte de contexte et l'achèvement prématuré des tâches.

![Aperçu de la bibliothèque de ressources](../../docs/public/screenshots/readme/zh-resources.png)

## Livres de Cours en PDF

Le dépôt inclut désormais un pipeline de génération de PDF pour le contenu du cours.

- Exécutez `npm run pdf:build` pour générer les PDF en anglais et en chinois localement.
- Les fichiers de sortie sont écrits dans `artifacts/pdfs/`.
- Exécutez `npm run screenshots:readme` si vous souhaitez mettre à jour les images d'aperçu du README.
- Le workflow GitHub Actions [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) peut construire les PDF et les publier sur les Releases GitHub.

---

## Le modèle est intelligent, le harness le rend fiable

Il y a une dure vérité que la plupart des gens apprennent à leurs dépens : **le modèle le plus puissant au monde échouera toujours sur de vraies tâches d'ingénierie si vous ne construisez pas un environnement approprié autour de lui.**

Vous l'avez probablement constaté vous-même. Vous donnez une tâche à Claude ou GPT dans votre dépôt. Cela commence bien -- il lit des fichiers, écrit du code, semble productif. Puis quelque chose tourne mal. Il saute une étape. Il casse un test. Il dit « terminé » mais rien ne fonctionne vraiment. Vous passez plus de temps à corriger qu si vous l'aviez fait vous-même.

Ce n'est pas un problème de modèle. C'est un problème de harness.

Les preuves sont claires. Anthropic a mené une expérience contrôlée : même modèle (Opus 4.5), même prompt (« construis un éditeur de jeux rétro 2D »). Sans harness, il a dépensé 9 $ en 20 minutes et a produit quelque chose qui ne fonctionnait pas. Avec un harness complet (planificateur + générateur + évaluateur), il a dépensé 200 $ en 6 heures et a construit un jeu auquel on pouvait réellement jouer. Le modèle n'a pas changé. Le harness, oui.

OpenAI a rapporté la même chose avec Codex : dans un dépôt bien équipé d'un harness, le même modèle passe de « peu fiable » à « fiable ». Pas une amélioration marginale -- un changement qualitatif.

**Ce cours vous apprend à construire cet environnement.**

```text
                    LE MODÈLE HARNESS
                    =================

    Vous --> donnez une tâche --> L'agent lit les fichiers harness --> L'agent exécute
                                                                      |
                                                     Le harness gouverne chaque étape :
                                                     |
                                                     +--> Instructions : quoi faire, dans quel ordre
                                                     +--> Portée :       une fonctionnalité à la fois, pas de surcharge
                                                     +--> État :         journal de progression, liste de fonctionnalités, historique git
                                                     +--> Vérification : tests, lint, vérification de types, essais de fumée
                                                     +--> Cycle de vie : initialisation au démarrage, état propre à la fin
                                                     |
                                                     v
                                                L'agent s'arrête uniquement quand
                                                la vérification réussit
```

---

## Ce que signifie réellement Harness Engineering

Le Harness Engineering consiste à construire un environnement de travail complet autour du modèle pour qu'il produise des résultats fiables. Il ne s'agit pas d'écrire de meilleurs prompts. Il s'agit de concevoir le système dans lequel le modèle opère.

Un harness comporte cinq sous-systèmes :

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                         LE HARNESS                              │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │ Instructions  │  │    État      │  │   Vérification       │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ tests + lint         │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ vérif. de types      │ │
    │   │ feature_list │  │ git log      │  │ essais de fumée      │ │
    │   │ docs/        │  │ transfert    │  │ pipeline e2e         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │   Portée     │  │       Cycle de vie de session         │   │
    │   │              │  │                                      │   │
    │   │ une seule    │  │ init.sh au démarrage                 │   │
    │   │ fonctionnalité│  │ liste de contrôle état propre à fin │   │
    │   │ définition   │  │ note de transfert pour prochaine     │   │
    │   │ de « terminé »│  │ commit uniquement si reprise sûre    │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    Le MODÈLE décide quel code écrire.
    Le HARNESS gouverne quand, où et comment il l'écrit.
    Le harness ne rend pas le modèle plus intelligent.
    Il rend la sortie du modèle fiable.
```

Chaque sous-système a une seule responsabilité :

- **Instructions** -- Indiquent à l'agent ce qu'il doit faire, dans quel ordre, et ce qu'il doit lire avant de commencer. Pas un fichier gigantesque ; une structure à divulgation progressive que l'agent navigue selon ses besoins.
- **State** -- Suivi de ce qui a été fait, de ce qui est en cours et de ce qui reste à faire. Les données sont persistées sur disque pour que la prochaine session reprenne exactement là où la précédente s'est arrêtée.
- **Verification** -- Seul un jeu de tests qui passe constitue une preuve. L'agent ne peut pas déclarer victoire sans une preuve exécutable.
- **Scope** -- Limite l'agent à une seule fonctionnalité à la fois. Pas de surcharge. Pas de trois choses à moitié terminées. Pas de réécriture de la liste de fonctionnalités pour masquer le travail inachevé.
- **Session Lifecycle** -- Initialisation au démarrage. Nettoyage à la fin. Laisser un chemin de redémarrage propre pour la prochaine session.

---

## Pourquoi ce cours existe

La question n'est pas « les modèles peuvent-ils écrire du code ? » Ils le peuvent. La question est : **peuvent-ils accomplir de manière fiable de vraies tâches d'ingénierie dans de vrais dépôts, sur plusieurs sessions, sans supervision humaine constante ?**

Pour l'instant, la réponse est : pas sans un harness.

```text
    SANS HARNESS                               AVEC HARNESS
    ===========                                ============

    Session 1 : l'agent écrit du code          Session 1 : l'agent lit les instructions
                l'agent casse les tests                   l'agent exécute init.sh
                l'agent dit « terminé »                   l'agent travaille sur une fonctionnalité
                vous corrigez manuellement                l'agent vérifie avant de déclarer « terminé »
                                                           l'agent met à jour le journal de progression
    Session 2 : l'agent repart de zéro                 l'agent commit un état propre
                l'agent n'a aucun souvenir
                de ce qui s'est passé avant       Session 2 : l'agent lit le journal de progression
                l'agent refait le travail                 l'agent reprend exactement là où il s'est arrêté
                ou fait autre chose totalement            l'agent continue la fonctionnalité inachevée
                vous corrigez encore                      vous révisez, vous ne sauvez pas

    Résultat : vous passez plus de temps       Résultat : l'agent fait le travail,
            à nettoyer qu si vous                     vous vérifiez le résultat
            l'aviez fait vous-même
```

Les questions auxquelles ce cours s'intéresse réellement :

- Quels modèles de harness améliorent les taux d'achèvement des tâches ?
- Quels modèles réduisent le retravail et les achèvements incorrects ?
- Quels mécanismes maintiennent une progression régulière des tâches de longue durée ?
- Quelles structures gardent le système maintenable après plusieurs exécutions de l'agent ?

---

## Programme d'Études et Documentation

Pour l'ensemble des matériaux du cours, veuillez visiter le **[Site de Documentation](https://walkinglabs.github.io/learn-harness-engineering/)**.

Le programme est divisé en trois parties :

1. **Cours magistraux** : 14 unités conceptuelles expliquant la théorie derrière le Harness Engineering.
2. **Projets** : 8 projets pratiques où vous construisez un espace de travail agentique à partir de zéro.
3. **Bibliothèque de Ressources** : Des modèles prêts à copier (`AGENTS.md`, `feature_list.json`, `init.sh`, etc.) à utiliser dans vos propres dépôts dès aujourd'hui.

---

## Démarrage Rapide : Améliorez votre agent dès aujourd'hui

Vous n'avez pas besoin de lire les 14 cours avant de commencer à en tirer profit. Si vous utilisez déjà un agent de codage sur un vrai projet, voici comment l'améliorer dès maintenant.

L'idée est simple : au lieu de simplement écrire des prompts, donnez à votre agent un ensemble de fichiers structurés qui définissent ce qu'il faut faire, ce qui a été fait et comment vérifier le travail. Ces fichiers résident dans votre dépôt, donc chaque session démarre depuis le même état.

```text
    RACINE DE VOTRE PROJET
    ├── AGENTS.md              <-- le manuel de fonctionnement de l'agent
    ├── CLAUDE.md              <-- (alternative, si vous utilisez Claude Code)
    ├── init.sh                <-- exécute installation + vérification + démarrage
    ├── feature_list.json      <-- quelles fonctionnalités existent, lesquelles sont terminées
    ├── claude-progress.md     <-- ce qui s'est passé à chaque session
    └── src/                   <-- votre code réel
```

Récupérez les modèles de démarrage depuis la [Bibliothèque de Ressources](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) et déposez-les dans votre projet. C'est tout. Quatre fichiers, et vos sessions d'agent seront déjà nettement plus stables qu'avec des prompts seuls.

---

## Projet Final : Une véritable application

Les huit projets du cours gravitent autour du même produit : **une application de bureau de base de connaissances personnelle basée sur Electron**.

```text
    ┌─────────────────────────────────────────────────────┐
    │         Application Bureau de Base de Connaissances │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │ Liste de     │  │     Panneau Q&R              ││
    │  │ documents    │  │                              ││
    │  │ doc-001.md   │  │  Q : Qu'est-ce que le harness││
    │  │ doc-002.md   │  │  R : L'environnement construit││
    │  │ doc-003.md   │  │     autour d'un modèle d'agent││
    │  │ ...          │  │     [citation : doc-002.md]   ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ Barre d'état : 42 docs | 38 indexés | sync 3m  ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    Fonctionnalités principales :
    ├── Importer des documents locaux
    ├── Gérer une bibliothèque de documents
    ├── Traiter et indexer des documents
    ├── Exécuter des Q&R alimentées par l'IA sur le contenu importé
    └── Retourner des réponses fondées avec des citations
```

Ce projet a été choisi car il combine une forte valeur pratique, une complexité produit suffisante pour le monde réel et un bon cadre pour observer les améliorations avant/après harness.

Le starter/solution de chaque projet du cours est une copie complète de cette application Electron à ce stade d'évolution. Le starter de P(N+1) est dérivé de la solution de P(N) -- l'application évolue au fur et à mesure que vos compétences en harness se développent.

---

## Parcours d'Apprentissage

Le cours est conçu pour être suivi dans l'ordre. Chaque phase s'appuie sur la précédente.

```text
    Phase 1 : VOIR LE PROBLÈME             Phase 2 : STRUCTURER LE DÉPÔT
    ===========================            =============================

    L01  Des modèles performants ≠         L03  Le dépôt comme unique
         une exécution fiable                    source de vérité
    L02  Ce que signifie réellement
         un harness                         L04  Répartir les instructions entre
                                               plusieurs fichiers, pas un seul fichier géant
         |
         v                                        |
    P01  Comparaison prompts seuls                v
         vs. règles d'abord                  P02  Espace de travail lisible par l'agent


    Phase 3 : CONNECTER LES SESSIONS      Phase 4 : RETOUR & PORTÉE
    =================================      =========================

    L05  Maintenir le contexte              L07  Définir des limites de tâches claires
         entre les sessions
                                           L08  Les listes de fonctionnalités comme
    L06  Initialiser avant chaque                primitives du harness
         session d'agent
                                                |
         |                                      v
         v                                      P04  Retour d'exécution pour
    P03  Continuité multi-sessions                   corriger le comportement de l'agent


    Phase 5 : VÉRIFICATION                Phase 6 : TOUT ASSEMBLER
    ======================                ========================

    L09  Empêcher les agents de           L11  Rendre l'exécution de l'agent
         déclarer victoire trop tôt             observable

    L10  Une exécution complète du        L12  Transfert propre à la fin de
         pipeline = vraie vérification         chaque session

         |                                      |
         v                                      v
    P05  L'agent vérifie son propre travail P06  Construire un harness complet
                                                (projet final)

    Phase 7 : AUTOMATISER LE LOOP
    =============================

    L13  Arrêtez de faire du prompting
         à vos agents — concevez des boucles
         |
         v
    P07  Construisez votre première boucle automatisée
         (boucle par but, boucle temporelle, maker-checker)

    Phase 8 : STRUCTURER LE SYSTÈME
    ================================

    L14  Dessinez le système comme un graphe —
         nœuds, arêtes, état partagé, routage
         |
         v
    P08  Dessinez votre workflow sous forme de graphe
         (graphe explicite, fan-out/fan-in parallèle,
          arête de retour arrière, collaboration homme-machine)
```

Chaque phase prend environ une semaine si vous suivez le cours à temps partiel. Si vous souhaitez aller plus vite, les phases 1 à 3 peuvent être effectuées en un long week-end.

---

## Programme d'Études

### Cours magistraux -- 14 unités conceptuelles, chacune répondant à une question fondamentale

*Lisez le texte complet de chaque cours sur le [Site de Documentation](https://walkinglabs.github.io/learn-harness-engineering/).*

| Session | Question | Idée Centrale |
|---------|----------|---------------|
| [L01](../../docs/fr/lectures/lecture-01-why-capable-agents-still-fail/index.md) | Pourquoi les modèles performants échouent-ils encore sur des tâches réelles ? | L'écart de capacité entre les benchmarks et l'ingénierie réelle |
| [L02](../../docs/fr/lectures/lecture-02-what-a-harness-actually-is/index.md) | Que signifie réellement « harness » ? | Cinq sous-systèmes : instructions, état, vérification, portée, cycle de vie |
| [L03](../../docs/fr/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | Pourquoi le dépôt doit-il être l'unique source de vérité ? | Si l'agent ne peut pas le voir, ça n'existe pas |
| [L04](../../docs/fr/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | Pourquoi un seul fichier d'instructions géant échoue-t-il ? | Divulgation progressive : donnez une carte, pas une encyclopédie |
| [L05](../../docs/fr/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | Pourquoi les tâches de longue durée perdent-elles leur continuité ? | Persister le progrès sur disque ; reprendre là où vous vous êtes arrêté |
| [L06](../../docs/fr/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | Pourquoi l'initialisation nécessite-t-elle sa propre phase ? | Vérifier que l'environnement est sain avant que l'agent ne commence à travailler |
| [L07](../../docs/fr/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | Pourquoi les agents vont-ils trop loin et n'en font-ils pas assez ? | Une seule fonctionnalité à la fois ; définition explicite de « terminé » |
| [L08](../../docs/fr/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | Pourquoi les listes de fonctionnalités sont-elles des primitives du harness ? | Des limites de portée lisibles par machine que l'agent ne peut pas ignorer |
| [L09](../../docs/fr/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | Pourquoi les agents déclarent-ils victoire trop tôt ? | Lacunes de vérification : confiance ≠ correction |
| [L10](../../docs/fr/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | Pourquoi les tests de bout en bout changent-ils les résultats ? | Seule une exécution complète du pipeline compte comme véritable vérification |
| [L11](../../docs/fr/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | Pourquoi l'observabilité appartient-elle au harness ? | Si vous ne pouvez pas voir ce que l'agent a fait, vous ne pouvez pas corriger ce qu'il a cassé |
| [L12](../../docs/fr/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | Pourquoi chaque session doit-elle laisser un état propre ? | Le succès de la prochaine session dépend du nettoyage de celle-ci |
| [L13](../../docs/fr/lectures/lecture-13-loop-engineering/index.md) | Pourquoi devez-vous arrêter de faire du prompting à vos agents vous-même ? | Du prompting manuel aux boucles autonomes — boucle par but, boucle temporelle, séparation maker-checker |
| [L14](../../docs/fr/lectures/lecture-14-graph-engineering/index.md) | Pourquoi une boucle unique évolue-t-elle en graphe ? | Des boucles simples à l'ingénierie des graphes — nœuds, arêtes, état partagé, routage, et le moment où il vaut vraiment la peine de dessiner |

### Projets -- 8 projets pratiques appliquant les méthodes des cours à la même application Electron

| Projet | Ce que vous faites | Mécanisme du Harness |
|--------|--------------------|----------------------|
| [P01](../../docs/fr/projects/project-01-baseline-vs-minimal-harness/index.md) | Exécuter la même tâche deux fois : avec prompts seuls vs. avec règles d'abord | Harness minimal : AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/fr/projects/project-02-agent-readable-workspace/index.md) | Restructurer le dépôt pour que l'agent puisse le lire | Espace de travail lisible par l'agent + fichiers d'état persistants |
| [P03](../../docs/fr/projects/project-03-multi-session-continuity/index.md) | Faire en sorte que l'agent reprenne là où il s'est arrêté | Journal de progression + transfert de session + continuité multi-sessions |
| [P04](../../docs/fr/projects/project-04-incremental-indexing/index.md) | Empêcher l'agent d'en faire trop ou pas assez | Retour d'exécution + contrôle de portée + indexation incrémentale |
| [P05](../../docs/fr/projects/project-05-grounded-qa-verification/index.md) | Faire en sorte que l'agent vérifie son propre travail | Auto-vérification + Q&A fondé + achèvement basé sur les preuves |
| [P06](../../docs/fr/projects/project-06-runtime-observability-and-debugging/index.md) | Construire un harness complet à partir de zéro (projet final) | Harness complet : tous les mécanismes + observabilité + étude d'ablation |
| [P07](../../docs/fr/projects/project-07-loop-engineering-first-loop/index.md) | Construire votre première boucle automatisée | Boucle par but, boucle temporelle, séparation maker-checker, gestion de l'état de boucle |
| [P08](../../docs/fr/projects/project-08-graph-engineering-first-graph/index.md) | Dessinez votre workflow sous forme de graphe | Nœuds/arêtes/état/routage explicites, fan-out/fan-in parallèle, arête de retour arrière, approbation homme-machine |

```text
    ÉVOLUTION DES PROJETS
    =====================

    P01  Prompts seuls vs. règles d'abord   Vous voyez le problème
     |
     v
    P02  Espace de travail lisible          Vous restructurez le dépôt
         par l'agent
     |
     v
    P03  Continuité multi-sessions          Vous connectez les sessions
     |
     v
    P04  Retour d'exécution & portée        Vous ajoutez des boucles de retour
     |
     v
    P05  Auto-vérification                  Vous faites en sorte que l'agent se vérifie
     |
     v
    P06  Harness complet (projet final)     Vous construisez le système complet
     |
     v
    P07  Votre première boucle              Vous sortez de la boucle
         automatisée
     |
     v
    P08  Dessinez votre workflow comme      Vous dessinez le système comme un graphe
         un graphe

    La solution de chaque projet devient le starter du projet suivant.
    L'application évolue. Vos compétences en harness grandissent avec elle.
```

### Bibliothèque de Ressources

- [English](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — templates, checklists, and method references
- [简体中文](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [繁體中文](https://walkinglabs.github.io/learn-harness-engineering/zh-TW/resources/) — 繁體中文範本、清單和方法參考
- [日本語](https://walkinglabs.github.io/learn-harness-engineering/ja/resources/) — テンプレート、チェックリスト、方法リファレンス
- [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/resources/) — 템플릿, 체크리스트, 방법 참고 자료
- [Español](https://walkinglabs.github.io/learn-harness-engineering/es/resources/) — plantillas, listas de verificación y referencias
- [Français](https://walkinglabs.github.io/learn-harness-engineering/fr/resources/) — modèles, listes de contrôle et références
- [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/resources/) — шаблоны, чек-листы и справочники
- [Deutsch](https://walkinglabs.github.io/learn-harness-engineering/de/resources/) — Vorlagen, Checklisten und Referenzen
- [العربية](https://walkinglabs.github.io/learn-harness-engineering/ar/resources/) — قوالب، قوائم تحقق ومراجع
- [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/resources/) — mẫu, danh sách kiểm tra và tài liệu tham khảo
- [Oʻzbekcha](https://walkinglabs.github.io/learn-harness-engineering/uz/resources/) — andozalar, tekshiruv roʻyxatlari va maʼlumotnomalar
- [Türkçe](https://walkinglabs.github.io/learn-harness-engineering/tr/resources/) — şablonlar, kontrol listeleri ve referanslar
- [Português (BR)](https://walkinglabs.github.io/learn-harness-engineering/pt-BR/resources/) — modelos, listas de verificação e referências de métodos

---

## Le Cycle de Vie de la Session de l'Agent

L'une des idées centrales de ce cours : **la session de l'agent doit suivre un cycle de vie structuré, pas être laissée au hasard.** Voici à quoi cela ressemble :

```text
    CYCLE DE VIE DE LA SESSION DE L'AGENT
    ======================================

    ┌──────────────────────────────────────────────────────────────────┐
    │  DÉMARRAGE                                                      │
    │                                                                  │
    │  1. L'agent lit AGENTS.md / CLAUDE.md                           │
    │  2. L'agent exécute init.sh (installation, vérif., contrôle)    │
    │  3. L'agent lit claude-progress.md (ce qui s'est passé)         │
    │  4. L'agent lit feature_list.json (terminé, à faire)            │
    │  5. L'agent vérifie git log (changements récents)               │
    │                                                                  │
    │  SÉLECTION                                                      │
    │                                                                  │
    │  6. L'agent choisit exactement UNE fonctionnalité inachevée     │
    │  7. L'agent travaille uniquement sur cette fonctionnalité       │
    │                                                                  │
    │  EXÉCUTION                                                      │
    │                                                                  │
    │  8. L'agent implémente la fonctionnalité                        │
    │  9. L'agent exécute la vérification (tests, lint, types)        │
    │  10. Si la vérification échoue : corriger et relancer           │
    │  11. Si la vérification réussit : enregistrer la preuve         │
    │                                                                  │
    │  CLÔTURE                                                        │
    │                                                                  │
    │  12. L'agent met à jour claude-progress.md                      │
    │  13. L'agent met à jour feature_list.json                       │
    │  14. L'agent enregistre ce qui reste cassé ou non vérifié       │
    │  15. L'agent commit (uniquement si la reprise est sûre)         │
    │  16. L'agent laisse un chemin de redémarrage propre             │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    Le harness gouverne chaque transition dans ce cycle de vie.
    Le modèle décide quel code écrire à chaque étape.
    Sans le harness, l'étape 9 devient « l'agent dit que ça a l'air correct ».
    Avec le harness, l'étape 9 est « les tests passent, le lint est propre, les types sont valides ».
```

---

## À qui ce cours s'adresse

Ce cours est destiné :

- Aux ingénieurs utilisant déjà des agents de codage et souhaitant une meilleure stabilité et qualité
- Aux chercheurs ou constructeurs souhaitant une compréhension systématique de la conception de harness
- Aux responsables techniques qui doivent comprendre comment la conception de l'environnement affecte les performances de l'agent

Ce cours n'est PAS destiné :

- Aux personnes cherchant une introduction à l'IA sans code
- Aux personnes qui ne s'intéressent qu'aux prompts et ne prévoient pas de construire de véritables implémentations
- Aux apprenants non préparés à laisser des agents travailler dans de vrais dépôts

---

## Prérequis

Il faut au moins l'un de ces outils :

- Claude Code
- Codex
- Un autre agent de codage IDE ou CLI prenant en charge l'édition de fichiers, l'exécution de commandes et les tâches multi-étapes

Le cours suppose que vous êtes capable de :

- Ouvrir un dépôt local
- Autoriser l'agent à modifier des fichiers
- Autoriser l'agent à exécuter des commandes
- Inspecter les résultats et réexécuter les tâches

Si vous ne disposez pas d'un tel outil, vous pouvez toujours lire le contenu du cours, mais vous ne pourrez pas réaliser les projets comme prévu.

---

## Aperçu Local

Ce dépôt utilise VitePress comme visualiseur de documentation.

```sh
npm install
npm run docs:dev        # Serveur de développement avec rechargement à chaud
npm run docs:build      # Build de production
npm run docs:preview    # Aperçu du site construit
```

Ouvrez ensuite l'URL locale affichée par VitePress dans votre navigateur.

---

## Prérequis Techniques

Requis :

- Familiarité avec le terminal, git et les environnements de développement local
- Capacité à lire et écrire du code dans au moins une pile applicative courante
- Expérience de base en débogage logiciel (lecture de logs, tests et comportement à l'exécution)
- Assez de temps à consacrer à un cours axé sur l'implémentation

Utile mais non requis :

- Expérience avec Electron, les applications de bureau ou les outils local-first
- Formation en tests, logging ou architecture logicielle
- Exposition préalable à Codex, Claude Code ou à des agents de codage similaires

---

## Références Principales

Primaires :

- [OpenAI : Harness engineering : leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic : Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic : Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI : Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic : Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain : Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler : Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor : Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

Consultez la liste complète de références en couches dans [`docs/fr/resources/reference/`](../../docs/fr/resources/reference/index.md).

---

## Structure du Dépôt

```text
learn-harness-engineering/
├── docs/                          # Site de documentation VitePress
│   ├── lectures/                  # 14 cours (index.md + exemples dans code/)
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... (14 au total)
│   ├── projects/                  # 8 descriptions de projets
│   │   ├── project-01-*/
│   │   └── ... (8 au total)
│   └── resources/                 # Modèles et références multilingues
│       ├── en/                    # Modèles, listes de contrôle et guides en anglais
│       ├── zh/                    # Modèles, listes de contrôle et guides en chinois
│       ├── ru/                    # Modèles, listes de contrôle et guides en russe
│       └── vi/                    # Modèles, listes de contrôle et guides en vietnamien
├── projects/
│   ├── shared/                    # Fondation partagée Electron + TypeScript + React
│   └── project-NN/               # Répertoires starter/ et solution/ par projet
├── skills/                        # Skills réutilisables pour agents IA
│   └── harness-creator/           # Skill de Harness Engineering
├── package.json                   # VitePress + outils de développement
└── CLAUDE.md                      # Instructions Claude Code pour ce dépôt
```

---

## Comment le cours est organisé

- Chaque cours se concentre sur une seule question
- Le cours comprend 8 projets
- Chaque projet nécessite que l'agent effectue un véritable travail
- Chaque projet compare les résultats avec un harness faible vs. un harness robuste
- Ce qui compte, c'est la différence mesurée, pas la quantité de documentation rédigée

---

## Skills

Ce dépôt inclut également des skills réutilisables pour agents IA que vous pouvez installer directement dans votre IDE ou espace de travail agentique.

- [**harness-creator**](../../skills/harness-creator/) : Un skill qui vous aide à générer un harness de niveau production pour votre propre projet en quelques minutes.

---

## Autres Cours

Notre équipe a également créé d'autres cours ! Découvrez-les :

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL** : Un programme pratique et open source qui comble le fossé entre les concepts de base de l'apprentissage par renforcement et l'alignement des LLM, le RLVR et les systèmes agentiques avancés.

---

## Historique des Étoiles

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## Remerciements

Ce cours a été inspiré par et puise ses idées dans [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) -- un guide progressif pour construire un agent à partir de zéro, d'une simple boucle à l'exécution autonome isolée.
