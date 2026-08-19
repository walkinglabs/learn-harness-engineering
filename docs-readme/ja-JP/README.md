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

> **AIコーディングエージェントを確実に動作させるための環境、状態管理、検証、制御メカニズムを構築するプロジェクトベースのコース。**

Learn Harness Engineering は、AIコーディングエージェントのエンジニアリングに特化したコースです。業界最先端の Harness Engineering の理論と実践を深く研究し、統合しました。主な参考文献は以下の通りです：

> **🆕 2026年8月更新：最先端Harness設計の分解解説**——4つの分解解説を含む新セクション：
>
> - **新セクション** [最先端Harness設計の分解解説](../../docs/ja/harness-designs/index.md)：本コースの5つのサブシステムからなるフレームワーク（指示、ツール、環境、状態、フィードバック）を適用し、4つの最先端プロダクトが実際のharnessをどのように構築しているかをリバースエンジニアリングする。
> - **Pi** [Piがharnessを構築する方法](../../docs/ja/harness-designs/pi/index.md)：最小限のカーネル、プログラム可能な拡張、そして「Piに作りたいものを頼む」を支えるコンテキストエンジニアリング。
> - **Claude Code** [Claude Codeがharnessを構築する方法](../../docs/ja/harness-designs/claude-code/index.md)：4層のメモリ、5段階のコンパクション、フック、そしてsub-agentの分離。
> - **Codex** [Codexがharnessを構築する方法](../../docs/ja/harness-designs/codex/index.md)：信頼できる唯一の情報源としてのリポジトリ、ディレクトリページとしてのAGENTS.md、そしてworktreeの分離。
> - **DeepSeek** [DeepSeekがharnessを構築する方法](../../docs/ja/harness-designs/deepseek/index.md)：「すべてはプラグイン」、能力の継ぎ目、そしてイベントパイプライン。
> - **全15言語**：サポートされているすべての言語で完全な翻訳を提供。
>
> **コアとなる見解：** 本コースはフレームワークを提供する。これらの分解解説は、同じ原則が実際の本番環境のharnessでどのように機能するかを示す。
>
> **🆕 2026年8月更新：グラフエンジニアリング（Graph Engineering）**——講義1回 + プロジェクト1つを追加：
>
> - **第14回** [単一ループからグラフエンジニアリングへ](../../docs/ja/lectures/lecture-14-graph-engineering/index.md)：なぜ単一ループの先に必ずグラフが生まれるのか——4層の重ね合わせ（prompt → context → loop → graph）とharnessの位置、グラフの4つの部品（ノード、エッジ、共有状態、ルーティング）、loop内のチェックポイントが規模上の3つの構造的失敗（Goodhart、上方向の失明、衝突）を救えない理由、フレームワーク非依存の6ステップで最初のグラフを構築する手順、GraphとWorkflowの違い、アンカー、公開前 vs 公開後のオープンソースプロジェクトの現状、オーケストレーション税、そして本当に図を描く価値があるとき。
> - **プロジェクト 08** [ワークフローをグラフとして描く](../../docs/ja/projects/project-08-graph-engineering-first-graph/index.md)：3つの発展的な実験——maker-checker loopを明示的なグラフに描く、並列のfan-out/fan-inノードを追加する、条件付きフォールバックエッジと人間による承認ノードを追加する。
>
> **コアとなる見解：** Loopはノードが1つだけのグラフである。タスクが分業、並列、共有状態、検証、リカバリを必要とするとき——それはもはやloopではなく、グラフになる。
>
> **🆕 2026年7月更新：ループエンジニアリング（Loop Engineering）**——講義1回 + プロジェクト1つ + コードテンプレートを追加：
>
> - **第13回** [なぜあなたはエージェントにプロンプトを与えるのをやめるべきか](../../docs/ja/lectures/lecture-13-loop-engineering/index.md)：`/goal` からループエンジニアリングの6つのプリミティブ（automations、worktrees、skills、connectors、sub-agents、external state）、生成者/評価者の分離、4つの静かなコスト、そして最初のループを段階的に構築する手順。
> - **プロジェクト 07** [初めての自動ループを構築する](../../docs/ja/projects/project-07-loop-engineering-first-loop/index.md)：3つの発展的な実験——目標ループ、タイマーループ、maker-checkerループ。手動 vs 自動化の比較、介入の減少の測定、ループから抜け出すことを学ぶ。
> - **コードテンプレート**：`goal-template.md`、`loop-state-template.md`、`maker-prompt.md`、`checker-prompt.md`——プラグアンドプレイのループ構築テンプレート。
>
> **コアとなる見解：** Harnessエンジニアリングは車を作る。ループエンジニアリングはその走る道路を設計する——そしてあなたは車の外から道路を設計する。

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **すぐに始めたい方へ：** [`skills/harness-creator/`](../../skills/harness-creator/) スキルを使えば、自分のプロジェクト向けに本格的なハーネス（AGENTS.md、機能リスト、init.sh、検証ワークフロー）を数分でスキャフォールドできます。

---

## 目次

- [✨ ビジュアルプレビュー](#ビジュアルプレビュー)
- [Harness Engineering が本当に意味すること](#harness-engineering-が本当に意味すること)
- [クイックスタート：今日からエージェントを改善する](#クイックスタート-今日からエージェントを改善する)
- [カプロジェクト：実際のアプリケーション](#カプロジェクト-実際のアプリケーション)
- [学習パス](#学習パス)
- [シラバス](#シラバス)
- [スキル](#スキル)
- [その他のコース](#その他のコース)

---

## ✨ ビジュアルプレビュー

### 🏠 コースホームページ
> 包括的なコース概要とコア思想の紹介により、明確なスタートパスを提供します。

![コースホームページプレビュー](../../docs/public/screenshots/readme/zh-home.png)

### 📖 没入型レクチャー
> 実際の課題とハンズオンプロジェクト（プロジェクト01など）の深い解説により、没入型の学習体験を提供します。

![コースレクチャープレビュー](../../docs/public/screenshots/readme/zh-lecture-01.png)

### 🗂️ すぐに使えるリソースライブラリ
> マルチターンAIエージェント開発における一般的な落とし穴（コンテキストの損失やタスクの早期完了など）を解決するために設計されたテンプレートと参照設定。

![リソースライブラリプレビュー](../../docs/public/screenshots/readme/zh-resources.png)

## PDF コースブック

このリポジトリには、コースコンテンツの PDF ビルドパイプラインが含まれています。

- `npm run pdf:build` を実行して、英語と中国語の PDF をローカルで生成します。
- 出力ファイルは `artifacts/pdfs/` に書き込まれます。
- README プレビュー画像を更新したい場合は、`npm run screenshots:readme` を実行してください。
- GitHub Actions ワークフロー [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) は PDF をビルドし、GitHub Releases に公開できます。

---

## モデルは賢い、ハーネスがそれを確実にする

ほとんどの人が痛い目を見て学ぶ厳しい真実があります：**世界最強のモデルであっても、周囲に適切な環境を構築しなければ、実際のエンジニアリングタスクでは失敗します。**

あなたも経験したことがあるかもしれません。Claude や GPT にリポジトリでタスクを与えます。最初はうまくいきます — ファイルを読み、コードを書き、生産的に見えます。しかし、どこかで問題が発生します。ステップを飛ばします。テストを壊します。「完了」と言いますが、実際には何も動いていません。自分でやった以上に修正に時間を費やすことになります。

これはモデルの問題ではありません。ハーネスの問題です。

証拠は明確です。Anthropic は対照実験を行いました：同じモデル（Opus 4.5）、同じプロンプト（「2Dレトロゲームエディタを構築して」）。ハーネスなしでは、20分で9ドル使って動かないものを生成しました。フルハーネス（プランナー + ジェネレーター + エバリュエーター）では、6時間で200ドル使って実際に遊べるゲームを構築しました。モデルは変わっていません。ハーネスが変わったのです。

OpenAI も Codex で同じことを報告しています：適切にハーネスされたリポジトリでは、同じモデルが「信頼性なし」から「信頼性あり」になります。わずかな改善ではなく、質的な変化です。

**このコースは、その環境の構築方法を教えます。**

```text
                    ハーネスパターン
                    ================

    あなた --> タスクを与える --> エージェントがハーネスファイルを読む --> エージェントが実行
                                                                      |
                                                            ハーネスが全ステップを管理：
                                                            |
                                                            +--> 指示：何を、どの順序で行うか
                                                            +--> スコープ：一度に一つの機能、過剰な範囲拡大なし
                                                            +--> 状態：進捗ログ、機能リスト、git履歴
                                                            +--> 検証：テスト、lint、型チェック、スモーク実行
                                                            +--> ライフサイクル：開始時に初期化、終了時にクリーンな状態
                                                            |
                                                            v
                                                       エージェントは検証が
                                                       通過した時のみ停止
```

---

## Harness Engineering が本当に意味すること

Harness Engineering は、モデルの周囲に完全な作業環境を構築し、信頼性の高い結果を生成させることです。より良いプロンプトを書くことではありません。モデルが内部で動作するシステムを設計することです。

ハーネスには5つのサブシステムがあります：

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                          ハーネス                                │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │    指示       │  │     状態      │  │       検証           │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ テスト + lint        │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ 型チェック            │ │
    │   │ feature_list │  │ git log      │  │ スモーク実行          │ │
    │   │ docs/        │  │ セションハンドオフ│ │  e2eパイプライン      │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │   スコープ    │  │          セッションライフサイクル       │   │
    │   │              │  │                                      │   │
    │   │ 一度に       │  │ 開始時にinit.shを実行                 │   │
    │   │ 一つの機能   │  │ 終了時にクリーン状態チェックリスト      │   │
    │   │ 完了の定義   │  │ 次セッションへのハンドオフノート        │   │
    │   │              │  │ 再開安全な場合のみコミット              │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    モデルは書くコードを決定する。
    ハーネスはいつ、どこで、どう書くかを管理する。
    ハーネスはモデルを賢くするわけではない。
    モデルの出力を信頼性のあるものにする。
```

各サブシステムには一つの役割があります：

- **Instructions** — エージェントに何を、どの順序で、開始前に何を読むべきかを伝えます。一つの巨大なファイルではなく、エージェントが必要に応じてナビゲートする段階的開示構造です。
- **State** — 何が完了し、何が進行中で、何が次かを追跡します。ディスクに永続化され、次のセッションは前回の続きから正確に再開できます。
- **Verification** — 合格したテストスイートのみが証拠として認められます。エージェントは実行可能な証拠なしに完了を宣言できません。
- **Scope** — エージェントを一度に一つの機能に制約します。過剰な範囲拡大なし。3つのことを中途半端に終わらせることなし。未完了の作業を隠すために機能リストを書き換えることなし。
- **Session Lifecycle** — 開始時に初期化。終了時にクリーンアップ。次のセッションのためのクリーンな再起動パスを残します。

---

## なぜこのコースが存在するのか

問題は「モデルはコードを書けるか？」ではありません。書けます。問題は：**実際のリポジトリ内で、複数のセッションにわたり、常に人間の監視なしに、実際のエンジニアリングタスクを確実に完了できるか？** ということです。

現時点での答えは：ハーネスなしでは無理です。

```text
    ハーネスなし                              ハーネスあり
    ==========                              ==========

    セッション1: エージェントがコードを書く      セッション1: エージェントが指示を読む
                エージェントがテストを壊す                 エージェントがinit.shを実行
                エージェントが「完了」と言う               エージェントが一つの機能に取り組む
                あなたが手動で修正                        エージェントが完了宣言前に検証
                                                         エージェントが進捗ログを更新
    セッション2: エージェントがゼロから開始               エージェントがクリーンな状態でコミット
                エージェントは前回の記憶がない
                                         セッション2: エージェントが進捗ログを読む
                エージェントが同じ作業をやり直す             エージェントが前回の続きから正確に再開
                または全く別のことをする                   エージェントが未完了の機能を継続
                あなたがまた修正                          あなたは確認する、修正するのではない

    結果: 自分でやるよりも                        結果: エージェントが作業を行い、
          修正に多くの時間を費やす                        あなたは結果を検証する
```

このコースが本当に重視している問い：

- どのハーネス設計がタスク完了率を向上させるか？
- どの設計が手戻りや誤った完了を減らすか？
- どのメカニズムが長時間実行タスクを着実に進行させるか？
- どの構造が複数回のエージェント実行後もシステムを保守可能に保つか？

---

## コースカリキュラムとドキュメント

完全なコース資料については、**[ドキュメントウェブサイト](https://walkinglabs.github.io/learn-harness-engineering/)** をご覧ください。

カリキュラムは3つの部分に分かれています：

1. **レクチャー**：Harness Engineering の背景理論を説明する14の概念ユニット。
2. **プロジェクト**：ゼロからエージェントワークスペースを構築する8つのハンズオンプロジェクト。
3. **リソースライブラリ**：自分のリポジトリで今日すぐ使えるコピー用テンプレート（`AGENTS.md`、`feature_list.json`、`init.sh` など）。

---

## クイックスタート：今日からエージェントを改善する

価値を得るために14のレクチャーをすべて読む必要はありません。すでに実際のプロジェクトでコーディングエージェントを使用している場合、今すぐ改善する方法は以下の通りです。

アイデアはシンプルです：プロンプトを書く代わりに、何をすべきか、何が完了しているか、作業をどう検証するかを定義する構造化ファイルのセットをエージェントに与えます。これらのファイルはリポジトリ内に存在するため、すべてのセッションが同じ状態から始まります。

```text
    あなたのプロジェクトルート
    ├── AGENTS.md              <-- エージェントの操作マニュアル
    ├── CLAUDE.md              <-- （代替、Claude Code を使用する場合）
    ├── init.sh                <-- install + verify + start を実行
    ├── feature_list.json      <-- 存在する機能、完了している機能
    ├── claude-progress.md     <-- 各セッションで何が起きたか
    └── src/                   <-- 実際のコード
```

[リソースライブラリ](https://walkinglabs.github.io/learn-harness-engineering/en/resources/)からスターターテンプレートを取得し、プロジェクトに配置してください。たったこれだけです。4つのファイルで、プロンプトだけで実行するよりもエージェントセッションが大幅に安定します。

---

## カプロジェクト：実際のアプリケーション

8つのコースプロジェクトはすべて同じ製品を中心に展開しています：**Electron ベースの個人ナレッジベースデスクトップアプリ**です。

```text
    ┌─────────────────────────────────────────────────────┐
    │            ナレッジベースデスクトップアプリ            │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │  ドキュメント  │  │         Q&Aパネル             ││
    │  │    リスト      │  │                              ││
    │  │ doc-001.md   │  │  Q: ハーネスエンジニアリング   ││
    │  │ doc-002.md   │  │     とは何か？                 ││
    │  │ doc-003.md   │  │  A: エージェントモデルの       ││
    │  │ ...          │  │     周囲に構築された環境...     ││
    │  │              │  │     [引用元: doc-002.md]       ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ ステータスバー: 42文書 | 38件インデックス済 | 最終同期 3分前││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    コア機能：
    ├── ローカルドキュメントのインポート
    ├── ドキュメントライブラリの管理
    ├── ドキュメントの処理とインデックス作成
    ├── インポートしたコンテンツに対するAI搭載Q&Aの実行
    └── 引用付きの根拠ある回答の返却
```

このプロジェクトが選ばれたのは、実用的な価値、十分な現実世界の製品複雑さ、ハーネス改善の前後を観察するのに適した設定を組み合わせているからです。

各コースプロジェクトのスターター/ソリューションは、その進化段階におけるこの Electron アプリの完全なコピーです。P(N+1) のスターターは P(N) のソリューションから派生します — アプリはあなたのハーネスキルの成長とともに進化します。

---

## 学習パス

このコースは順番に進めるように設計されています。各フェーズは前のフェーズの上に構築されます。

```text
    フェーズ1: 問題を見る                      フェーズ2: リポジトリを構造化
    =================================         =================================

    L01  強力なモデル ≠ 確実な実行             L03  リポジトリを唯一の
                                              信頼できる情報源にする
    L02  ハーネスが実際に意味するもの
                                              L04  指示を複数ファイルに分割、
         |                                    一つの巨大ファイルにしない
         v
    P01  プロンプトのみ vs.                          |
         ルール優先の比較                             v
                                                   P02  エージェント可読ワークスペース


    フェーズ3: セッションを接続               フェーズ4: フィードバックとスコープ
    =================================         ====================================

    L05  セッション間で                        L07  明確なタスク境界を引く
         コンテキストを維持
                                              L08  機能リストをハーネスの
    L06  毎回のエージェント                          プリミティブとして使う
         セッション前に初期化
                                                   |
         |                                         v
         v                                         P04  エージェントの動作を修正する
    P03  マルチセッション連続性                        ランタイムフィードバック


    フェーズ5: 検証                           フェーズ6: すべてを統合
    =====================                     ============================

    L09  エージェントが早すぎる                 L11  エージェントのランタイムを
         完了宣言をするのを防ぐ                      観測可能にする

    L10  フルパイプライン実行 =                 L12  全セッションの終了時に
         本当の検証                                  クリーンなハンドオフ

         |                                         |
         v                                         v
    P05  エージェントが自分の作業を検証          P06  完全なハーネスを構築
                                                   （カプロジェクト）

    フェーズ7: 自動化ループ
    ==========================
    L13  エージェントにプロンプトを
         与えるのをやめる——ループを設計する
         |
         v
    P07  初めての自動ループを構築する
         （目標ループ、タイマーループ、maker-checker）

    フェーズ8: システムを構造化
    ============================
    L14  システムをグラフとして描く——
         ノード、エッジ、共有状態、ルーティング
         |
         v
    P08  ワークフローをグラフとして描く
         （明示グラフ、並列 fan-out/fan-in、
          フォールバックエッジ、人間と機械の協働）
```

パートタイムで進める場合、各フェーズは約1週間です。より速く進めたい場合、フェーズ1〜3は長い週末で完了できます。

---

## シラバス

### レクチャー — 14の概念ユニット、それぞれが一つのコアな問いに答える

*各レクチャーの全文は[ドキュメントウェブサイト](https://walkinglabs.github.io/learn-harness-engineering/)で読めます。*

| セッション | 問い | コアアイデア |
|---------|----------|-----------|
| [L01](../../docs/ja/lectures/lecture-01-why-capable-agents-still-fail/index.md) | なぜ強力なモデルでも実際のタスクで失敗するのか？ | ベンチマークと実際のエンジニアリングの能力格差 |
| [L02](../../docs/ja/lectures/lecture-02-what-a-harness-actually-is/index.md) | 「ハーネス」とは実際何を意味するのか？ | 5つのサブシステム：インストラクション、状態、検証、スコープ、ライフサイクル |
| [L03](../../docs/ja/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | なぜリポジトリが唯一の信頼できる情報源でなければならないのか？ | エージェントが見られないものは存在しない |
| [L04](../../docs/ja/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | なぜ一つの巨大な指示ファイルは失敗するのか？ | 段階的開示：百科事典ではなく地図を与える |
| [L05](../../docs/ja/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | なぜ長時間実行タスクは連続性を失うのか？ | 進捗をディスクに永続化し、前回の続きから再開する |
| [L06](../../docs/ja/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | なぜ初期化に独自のフェーズが必要なのか？ | エージェントが作業を開始する前に環境が健全であることを確認する |
| [L07](../../docs/ja/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | なぜエージェントは過剰に手を出し、不足して終わるのか？ | 一度に一つの機能、明確な完了の定義 |
| [L08](../../docs/ja/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | なぜ機能リストはハーネスのプリミティブなのか？ | エージェントが無視できない機械可読なスコープ境界 |
| [L09](../../docs/ja/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | なぜエージェントは早すぎる完了を宣言するのか？ | 検証のギャップ：確信 ≠ 正確性 |
| [L10](../../docs/ja/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | なぜエンドツーエンドテストが結果を変えるのか？ | 完全なパイプライン実行のみが本当の検証として認められる |
| [L11](../../docs/ja/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | なぜオブザーバビリティはハーネス内にあるべきなのか？ | エージェントが何をしたか見えなければ、何を壊したか修正できない |
| [L12](../../docs/ja/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | なぜすべてのセッションがクリーンな状態を残さなければならないのか？ | 次のセッションの成功は、このセッションのクリーンアップに依存する |
| [L13](../../docs/ja/lectures/lecture-13-loop-engineering/index.md) | エージェントにプロンプトを与えるのをやめるべきなのはなぜか？ | 手動駆動から自動ループへ——目標ループ、タイマーループ、生成者/評価者の分離 |
| [L14](../../docs/ja/lectures/lecture-14-graph-engineering/index.md) | なぜ単一ループがグラフへと進化するのか？ | 単一ループからグラフエンジニアリングへ——ノード、エッジ、共有状態、ルーティング、そして本当に図を描く価値があるとき |

### プロジェクト — レクチャーの手法を同じ Electron アプリに適用する8つのハンズオンプロジェクト

| プロジェクト | やること | ハーネスメカニズム |
|---------|------------|-------------------|
| [P01](../../docs/ja/projects/project-01-baseline-vs-minimal-harness/index.md) | 同じタスクを2回実行：プロンプトのみ vs. ルール優先 | 最小ハーネス：AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/ja/projects/project-02-agent-readable-workspace/index.md) | エージェントが読めるようにリポジトリを再構築する | エージェント可読ワークスペース + 永続状態ファイル |
| [P03](../../docs/ja/projects/project-03-multi-session-continuity/index.md) | エージェントが前回の続きから再開できるようにする | 進捗ログ + セションハンドオフ + マルチセッション連続性 |
| [P04](../../docs/ja/projects/project-04-incremental-indexing/index.md) | エージェントがやりすぎたり、やらなすぎたりするのを防ぐ | ランタイムフィードバック + スコープ制御 + インクリメンタルインデキシング |
| [P05](../../docs/ja/projects/project-05-grounded-qa-verification/index.md) | エージェントが自分の作業を検証するようにする | 自己検証 + グラウンデッドQ&A + 証拠ベースの完了 |
| [P06](../../docs/ja/projects/project-06-runtime-observability-and-debugging/index.md) | ゼロから完全なハーネスを構築する（カプロジェクト） | フルハーネス：全メカニズム + オブザーバビリティ + アブレーションスタディ |
| [P07](../../docs/ja/projects/project-07-loop-engineering-first-loop/index.md) | 初めての自動ループを構築する | 目標ループ、タイマーループ、生成者/評価者の分離、ループ状態管理 |
| [P08](../../docs/ja/projects/project-08-graph-engineering-first-graph/index.md) | ワークフローをグラフとして描く | 明示的なノード/エッジ/状態/ルーティング、並列 fan-out/fan-in、フォールバックエッジ、人間と機械の協働による承認 |

```text
    プロジェクトの進化
    ==================

    P01  プロンプトのみ vs. ルール優先       問題を目撃する
     |
     v
    P02  エージェント可読ワークスペース       リポジトリを再構築する
     |
     v
    P03  マルチセッション連続性              セッションを接続する
     |
     v
    P04  ランタイムフィードバックとスコープ   フィードバックループを追加する
     |
     v
    P05  自己検証                           エージェントに自己チェックさせる
     |
     v
    P06  完全なハーネス（カプロジェクト）    完全なシステムを構築する
     |
     v
    P07  初めての自動ループ                   あなたはループから抜け出す
     |
     v
    P08  ワークフローをグラフとして描く       あなたはシステムをグラフにする

    各プロジェクトのソリューションが次のプロジェクトのスターターになる。
    アプリは進化する。あなたのハーネスキルも共に成長する。
```

### リソースライブラリ

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

## エージェントセッションライフサイクル

このコースのコアアイデアの一つ：**エージェントのセッションは自由放任ではなく、構造化されたライフサイクルに従うべきです。** どのようなものか：

```text
    エージェントセッションライフサイクル
    ====================================

    ┌──────────────────────────────────────────────────────────────────┐
    │  開始                                                            │
    │                                                                  │
    │  1. エージェントがAGENTS.md / CLAUDE.mdを読む                    │
    │  2. エージェントがinit.shを実行（インストール、検証、ヘルスチェック）│
    │  3. エージェントがclaude-progress.mdを読む（前回の内容）          │
    │  4. エージェントがfeature_list.jsonを読む（完了済み、次の作業）    │
    │  5. エージェントがgit logを確認（最近の変更）                     │
    │                                                                  │
    │  選択                                                            │
    │                                                                  │
    │  6. エージェントは未完了の機能を正確に1つだけ選択                 │
    │  7. エージェントはその機能のみに取り組む                          │
    │                                                                  │
    │  実行                                                            │
    │                                                                  │
    │  8. エージェントが機能を実装する                                  │
    │  9. エージェントが検証を実行（テスト、lint、型チェック）         │
    │  10. 検証失敗時：修正して再実行                                  │
    │  11. 検証通過時：証拠を記録                                      │
    │                                                                  │
    │  仕上げ                                                          │
    │                                                                  │
    │  12. エージェントがclaude-progress.mdを更新                      │
    │  13. エージェントがfeature_list.jsonを更新                       │
    │  14. エージェントがまだ壊れている、または未検証の項目を記録      │
    │  15. エージェントがコミット（再開安全な場合のみ）                 │
    │  16. エージェントが次セッション用のクリーンな再起動パスを残す    │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    ハーネスはこのライフサイクルの全移行を管理する。
    モデルは各ステップで書くコードを決定する。
    ハーネスなしでは、ステップ9は「エージェントが大丈夫そうだと言う」になる。
    ハーネスありでは、ステップ9は「テスト通過、lintクリーン、型チェックOK」になる。
```

---

## 対象者

このコースは以下の方を対象としています：

- コーディングエージェントをすでに使用しており、安定性と品質を向上させたいエンジニア
- ハーネス設計の体系的な理解を求める研究者やビルダー
- 環境設計がエージェントのパフォーマンスにどう影響するかを理解する必要があるテックリード

このコースは以下の方を対象としていません：

- ゼロコードの AI 入門を求める方
- プロンプトにしか関心がなく、実際の実装を構築する予定のない方
- エージェントを実際のリポジトリ内で動かす準備ができていない学習者

---

## 必要なツール

このコースでは実際にコーディングエージェントを動かします。

以下のツールのうち少なくとも1つが必要です：

- Claude Code
- Codex
- ファイル編集、コマンド実行、マルチステップタスクをサポートする他の IDE または CLI コーディングエージェント

このコースでは以下ができることを前提としています：

- ローカルリポジトリを開く
- エージェントにファイルの編集を許可する
- エージェントにコマンドの実行を許可する
- 出力を確認し、タスクを再実行する

このようなツールがない場合でも、コースコンテンツを読むことはできますが、プロジェクトを意図通りに完了することはできません。

---

## ローカルプレビュー

このリポジトリは VitePress をドキュメントビューアとして使用しています。

```sh
npm install
npm run docs:dev        # ホットリロード付き開発サーバー
npm run docs:build      # プロダクションビルド
npm run docs:preview    # ビルド済みサイトのプレビュー
```

その後、VitePress が出力するローカル URL をブラウザで開いてください。

---

## 前提条件

必須：

- ターミナル、git、ローカル開発環境に慣れていること
- 少なくとも1つの一般的なアプリケーションスタックでコードの読み書きができること
- 基本的なソフトウェアデバッグ経験（ログ、テスト、ランタイム動作の読み取り）
- 実装重視のコースワークに十分な時間を投入できること

あれば役立つが必須ではない：

- Electron、デスクトップアプリ、ローカルファーストツールの経験
- テスト、ロギング、ソフトウェアアーキテクチャの背景知識
- Codex、Claude Code、または類似のコーディングエージェントの使用経験

---

## 主な参考文献

主要：

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

完全な階層別参考文献リストは [`docs/ja/resources/reference/`](../../docs/ja/resources/reference/index.md) をご覧ください。

---

## リポジトリ構造

```text
learn-harness-engineering/
├── docs/                          # VitePress ドキュメントサイト
│   ├── lectures/                  # 14のレクチャー（index.md + code/ 例）
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... (全14)
│   ├── projects/                  # 8つのプロジェクト説明
│   │   ├── project-01-*/
│   │   └── ... (全8)
│   └── resources/                 # 多言語テンプレートとリファレンス
│       ├── en/                    # 英語テンプレート、チェックリスト、ガイド
│       ├── zh/                    # 中国語テンプレート、チェックリスト、ガイド
│       ├── ru/                    # ロシア語テンプレート、チェックリスト、ガイド
│       └── vi/                    # ベトナム語テンプレート、チェックリスト、ガイド
├── projects/
│   ├── shared/                    # 共有 Electron + TypeScript + React 基盤
│   └── project-NN/               # プロジェクトごとの starter/ と solution/ ディレクトリ
├── skills/                        # 再利用可能な AI エージェントスキル
│   └── harness-creator/           # Harness Engineering スキル
├── package.json                   # VitePress + 開発ツール
└── CLAUDE.md                      # このリポジトリの Claude Code 指示
```

---

## コースの構成

- 各レクチャーは一つの問いに焦点を当てる
- コースには8つのプロジェクトが含まれる
- すべてのプロジェクトでエージェントが実際の作業を行う
- すべてのプロジェクトで弱いハーネスと強いハーネスの結果を比較する
- 重要なのは測定された差であり、書かれたドキュメントの数ではない

---

## スキル

このリポジトリには、IDE やエージェントワークスペースに直接インストールできる再利用可能な AI エージェントスキルも含まれています。

- [**harness-creator**](../../skills/harness-creator/): 自分のプロジェクト向けに本格的なハーネスを数分でスキャフォールドするスキル。

---

## その他のコース

私たちのチームは他のコースも作成しています！ぜひご覧ください：

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**：基本的な強化学習の概念から LLM アライメント、RLVR、高度なエージェントシステムまでをつなぐ、オープンソースのハンズオンカリキュラム。

---

## スター履歴

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## 謝辞

このコースは [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) にインスピレーションを受け、アイデアを得ています — 単一のループから独立した自律実行まで、ゼロからエージェントを構築する段階的ガイド。
