# Codex の harness 設計を読み解く

OpenAI の [Codex](https://openai.com/index/harness-engineering/) は、4つの製品の中で最も「harness の原則」と深く結びついているかもしれません。この分野全体の名前を定義した『Harness Engineering』という記事自体が、OpenAI チームが Codex を使って製品を開発した経験のまとめだからです。したがって、Codex の harness 設計を読み解くことは、その記事の背後にあるエンジニアリング実践を読み解くことでもあります。

Codex の思想は、次の一文に要約できます。**リポジトリを唯一の事実源（repository as the system of record）にし、AGENTS.md は目次ページにとどめる。エンジニアリングの価値は、環境を設計し、意図を表現し、フィードバックループを構築することにある。**

## 一言で表すと

OpenAI チームは Codex を使い、数週間で、最終的に100万行を超えるコードからなる製品を提供しました。**すべてのコード行を Codex が書いています**（原文は [Harness Engineering](https://openai.com/index/harness-engineering/) の "Designing for growth" セクションを参照）。この実践は、エンジニアの役割が「コードを書くこと」から「harness を設計すること」へ変わったとき、システムをどう組織すべきかという問いに答えています。Codex CLI 自体はオープンソースのモノリシックなバイナリ（Rust 実装、[github.com/openai/codex](https://github.com/openai/codex)）ですが、harness への主な貢献は、華やかな拡張点ではなく、**規約（convention）**と**コンテキストエンジニアリング**にあります。

## 指示サブシステム：AGENTS.md は百科事典ではなく目次ページ

これは、Codex が harness 理論へ与えた最も影響力のある設計の一つです。

> 単一の巨大な指示ファイルは、機械的なチェック（カバレッジ、更新状況、所有者、相互リンク）に適さず、現実との乖離を避けられません。そのため、AGENTS.md を百科事典として扱うのをやめ、**目次ページ**として扱います。コードベースの知識は構造化されたドキュメントに置き、AGENTS.md はそこへの案内を担います。

（上記は、[『Harness Engineering』原文](https://openai.com/index/harness-engineering/)の "AGENTS.md should be a directory page" セクションを直接言い換えたものです。）

講義04では「単一の巨大な指示ファイルは失敗する」と説明しました。Codex は、その明確な解決策を示しています。AGENTS.md は100行程度に抑え（原文では約100行を推奨し、上限に近づいたら `docs/` へ分割）、収まらない内容は `docs/` ディレクトリへ分割して、agent がオンデマンドで読みます。これは「説明書ではなく地図を渡す」という原則の権威ある出典です。

これを支える原則は、**実装を細かく管理せず、不変条件を強制する**ことです（原文："don't micromanage the implementation；focus on invariants"）。AGENTS.md には、違反できない厳格な制約と検証コマンドだけを記載し、具体的な実装方法はモデルへ任せます。これは講義02の「細かな指示ではなく制約を与える」に直接対応します。

## コンテキストサブシステム：Write-Select-Compress-Isolate

Codex のコンテキストエンジニアリングは、4つの戦略にまとめられます。これは "context engineering" が独立した分野となった後、コミュニティが整理して Codex へマッピングしたフレームワークです（出典は [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)）。

- **Write（外へ書き出す）**：コンテキストをウィンドウの外側へ永続化します。結論はドキュメントへ、状態はファイルへ書き、対話内だけに残しません。「リポジトリを唯一の事実源にする」に対応します。
- **Select（中へ選び入れる）**：必要な token だけをウィンドウへ取り込みます。AGENTS.md で案内し、ファイルをオンデマンドで読み、リポジトリ全体を詰め込みません。
- **Compress（圧縮する）**：本当に重要な情報を残します。Codex には自動 compaction と手動の `/compact` があり、`compact_prompt` をカスタマイズできます（[Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)を参照）。
- **Isolate（分離する）**：コンテキストを異なる境界へ切り分けます。subagent で異なるタスクのコンテキストを分離し、フロントエンドの subagent がバックエンドのデータベース schema を見ることがないようにします。

Codex には、さらに細かな環境コンテキストの設計があります。コミュニティによる [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) のソース分析によると、`build_environment_update_item` は、環境が変化したときだけ**変更されたフィールド**（CWD、git branch、ファイルシステム）を出力し、毎回完全なシステムコンテキストを貼り直しません。これは「コンテキスト内で重複 token を増やさない」ためのエンジニアリング上の工夫です。

## ツールと境界：worktree による分離 + subagent

Codex には、2つの中核的な harness メカニズムがあります。

**1. git worktree による環境分離。** [『Harness Engineering』原文](https://openai.com/index/harness-engineering/)の "Environment" セクションには、各タスクを独立した git worktree で実行し、ローカルの可観測性 stack（ログ、メトリクス、トレース）と組み合わせて、各変更を独立した環境で検証すると明記されています。これは講義07「agent に各タスクの境界を明確にする」の物理的な実装です。境界を指示でお願いするのではなく、環境分離によって強制します。ここでは、環境（environment）サブシステムがハードな分離として実装されています。

**2. コアレベルの subagent。** Codex の `spawn_agent` / `wait_agent` はコアレベルのツールです。モデルが明示的に subagent を作成し、独立した session 履歴とツールセットを与え、その結果を待ちます。subagent は親の AGENTS.md の指示を継承しますが、**独自のコンテキスト**で動作します。設定は `.codex/agents/*.toml` に置き、異なるモデルと指示を指定できます（詳細は [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) の Sub-agents セクションを参照）。これは「コンテキスト分離」の直接的な実装であり、講義12の「ハンドオフ」の考え方も表しています。各 subagent は明確な境界を持つ作業単位です。

## フィードバックサブシステム：検証コマンドを規約へ組み込む

OpenAI の実践で最も強調されていることの一つは、AGENTS.md に検証コマンドを明記し、「正しくできたことをどう確認するか」をリポジトリの一部にすることです。Codex のエンジニアリングフローでは、テスト、CI、ドキュメント、可観測性設定のすべてを Codex が生成し、そのすべてが「実行可能な検証経路」になります。強力だが信頼できないモデルへの解決策は、モデルの自発性を祈ることではありません。**検証経路を harness のデフォルトコンポーネントにする**ことです。

approval policies と plan mode は、別の方向からフィードバックを提供します。高リスクな操作を行う前に計画を提示し、承認を求めることで、「タスク境界」と「人間の決定権」を runtime の制御として実装します。

## 講義のフレームワークへのマッピング

| サブシステム | Codex の実装 | 評価 |
| --- | --- | --- |
| 指示 | AGENTS.md の目次ページ + docs/ への分割 + 不変条件の強制 | 教科書的。「説明書ではなく地図を渡す」を定義した |
| ツール | worktree による分離 + spawn_agent subagent | 環境で境界をハードに分離し、非常に強力 |
| 環境 | 独立した worktree + 可観測性 stack | worktree による分離が象徴的な特徴 |
| 状態 | Write 戦略（状態をファイル/ドキュメントへ書き出す） | 組み込みメモリではなく規約に依存する |
| フィードバック | 規約に含めた検証コマンド + approval policies + plan mode | フィードバック経路をデフォルト化しており、参考になる |

Codex と Claude Code の比較は興味深いものです。Claude Code は「足し算」で、メモリ、permissions、subagent をすべてコアへ組み込みます。Codex は「引き算」で、コアをできるだけ抑制し、より多くの責任をリポジトリ規約とコンテキストエンジニアリングへ置きます。コミュニティで「Codex はコードより harness の思想のほうが価値がある」とよく言われるのは、このためです。

## 参考にしたい設計

1. **AGENTS.md を目次ページとして書く**：100行程度に抑え、docs/ 内の詳細を参照させ、機械的にチェックできるようにします。
2. **実装を細かく管理せず、不変条件だけを書く**：厳格な制約 + 検証コマンドを記載し、残りはモデルへ任せます。
3. **worktree で環境を分離する**：タスク境界は環境で強制し、指示でお願いしません。
4. **環境コンテキストは差分だけを渡す**：各ターンで変更されたフィールドだけを出力し、完全なシステムコンテキストを繰り返し貼りません。
5. **subagent でコンテキストを分離する**：タスクと同時にコンテキストも分割し、subtask でメインループを汚染させません。

## 参考資料（原文 / ソースコード）

以下の原文またはソースコードから各主張を確認できるため、印象に基づく説明ではありません。

- **OpenAI『Harness Engineering』**：AGENTS.md の目次ページと約100行という推奨、executive invariants / don't micromanage、worktree による分離 + 可観測性 stack、規約に含めた検証コマンド、100万行を超える製品事例、approval policies と plan mode。この記事におけるすべての中核的な主張の主要な出典です。<br/>https://openai.com/index/harness-engineering/
- **OpenAI 公式『AGENTS.md』規約**（AGENTS.md をツール横断の規約にする標準）：<br/>https://openai.com/index/agents-md/
- **Codex CLI オープンソースリポジトリ**（Rust で実装されたモノリシックなバイナリ）：<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI**（コミュニティ）：Write-Select-Compress-Isolate フレームワーク、`/compact` と `compact_prompt`、`spawn_agent` / `wait_agent` subagent と `.codex/agents/*.toml` 設定。<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals**（コミュニティによるソース分析）：`build_environment_update_item` による環境コンテキストの差分など、実装の詳細。<br/>https://github.com/AlexKenbo/codex-harness-internals

関連講義：[講義03 · リポジトリをシステムの記録にする](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [講義04 · 指示を複数のファイルに分割する](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [講義07 · エージェントに各タスクの境界を明確にする](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
