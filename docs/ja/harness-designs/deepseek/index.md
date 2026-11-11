# DeepSeek Harness の設計を読み解く

[DeepSeek Harness](https://deepseek.com/harness)（コマンド名 `dsh`、リポジトリ `deepseek-ai/deepseek-harness`）は、2026年8月に Developer Preview として公開されました。公式による定義は明快です。**Agent = Model + Environment + Tools + State**、つまりモデル、環境、ツール、状態の4要素です。

これまでの3製品の分析が「harness をどう設計すべきか」という問いだったとすれば、DeepSeek Harness はさらに大胆な問いを投げかけています。**harness は特定のモデルから切り離され、独立した runtime になれるのか。** その答えは「できる」であり、これを徹底しています。[アーキテクチャドキュメント](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)の原文では、*Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself*（製品のすべての部分が plugin であり、モデル adapter、ツール registry、session log、さらには agent loop 自体も含まれる）と説明されています。

この記事では、plugin 化されたコア、capability seam、event pipeline、そして最も強力なエンジニアリング上の制約である "Model-visible means logged" の3点を中心に読み解きます。

## 一言で表すと

従来の coding agent の構造は、「LLM + 固定された agent loop + 固定されたツールセット」です。DeepSeek Harness の構造は「モデル + plugin コア（Cordis）」です。コアは plugin の読み込み、アンロード、依存関係、イベントメカニズムだけを担い、**agent 固有の能力を一切所有しません**。[アーキテクチャドキュメント](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)の原文は、"There is no privileged core to patch"（patch が必要な特権コアは存在しない）、"you extend dsh by mounting a plugin beside the others"（コアを変更せず、ほかの plugin と並べて一つの plugin を mount すれば dsh を拡張できる）と述べています。これは、agent loop 自体さえ変更不可侵ではないことを意味します。DeepSeek のモデル、Claude Code の subagent、リモート sandbox、カスタムメモリ、カスタムループ、カスタム UI を組み合わせ、まったく新しい agent を構成できます。

これは、講義の「モデルの重みパラメータ以外のすべてが harness」という言葉を最も徹底して実践したものです。harness が独立したものであるなら、独立した OS にしてしまおうという設計です。

## アーキテクチャの中核 1：Capability Seam

DeepSeek Harness は「能力」を Service として表し、ほぼすべての能力を3層に分けています。

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

ファイルシステムを例にすると、`FS Service` の下には Local FS、E2B FS、Remote FS という複数の Provider があり、上位には統一された file tools として公開されます。Shell、Subprocess、Sandbox、Web、LLM、SubAgent も同じ構造です。この3層構造は、私たちの要約ではありません。[アーキテクチャドキュメント · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)の原文に、*a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool*（capability seam は交換可能な能力であり、インターフェースを宣言する Service Definition、それを実装する Service Provider、それを使用する Consumer という3つの役割を持つ。Consumer は通常、モデル向けのツールである）とあります。

これは harness エンジニアリングに長く存在してきた問題を解決します。**agent は「具体的なツール」に依存すべきか、それとも「能力インターフェース」に依存すべきか。** DeepSeek Harness は後者を選びました。講義の観点では、「ツールサブシステム」がインターフェースとして標準化されたことを意味します。Provider を交換しても、モデルに公開されるツールの形は変わりませんが、環境は完全に変わります。

## アーキテクチャの中核 2：Event Pipeline

DeepSeek Harness の内部は、単純な「LLM → ツール → LLM」ではなく、event pipeline になっています。各段階が plugin から監視できるイベントポイントです。

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

（上記の pipeline は、[アーキテクチャドキュメント · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)セクションの内容を書き換えたものです。`turn/*`、`step/*`、`user/message`、`assistant/*`、`tool/*` は永続化される session イベントであり、`agent/pre-step`、`agent/request`、`llm/stream`、`tools/*` は plugin が監視できる拡張点です。）

この設計の最大の利点は、**多くの機能が agent loop 自体を変更せずに実装できる**ことです。ツール実行前にセキュリティチェックを行うなら、`tools/pre-execute` を監視します。メモリを追加するなら、`agent/pre-step` で注入します。動作を記録するなら、session イベントを購読します。モデルへのリクエストを変更するなら、`agent/request` に hook します。推論を続けるかどうかを決めるなら、`agent/turn-stopping` を監視します。

講義11「エージェントの動作を可観測にする」と比べると、DeepSeek Harness はさらに先へ進んでいます。「ログを追加する」のではなく、**ループの各段階をイベントポイントにする**ことで、可観測性、permissions、メモリ、ポリシーをすべてリスナーとしてループへ接続し、ループ内にハードコードしません。

## アーキテクチャの中核 3：Session Event Log と "Model-visible means logged"

DeepSeek Harness には、**append-only の Session Event Log（追記専用の session イベントログ）**があり、非常に強力なエンジニアリング上の制約を定めています。[アーキテクチャドキュメント · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)の原文は次のとおりです。

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

（モデルから見えるものは、すべて記録される。モデルへのリクエストに届くものはすべてログから再構築可能でなければならず、runtime invariant がそれを強制する。）

言い換えれば、可観測性は後から補うログではなく、harness の第一原則です。モデルのコンテキストへ入るものは、デフォルトでログに残るべきだという考え方です。これは最終講義の「可観測性は harness の内部に属する」と直接対応します。また、"append-only" というストレージ設計を原則にし、ログを追記するだけで上書きせず、session の状態をリプレイ可能にします。

## 講義のフレームワークへのマッピング

| サブシステム | DeepSeek Harness の実装 | 評価 |
| --- | --- | --- |
| 指示 | plugin 化。ルール/Skills を plugin として注入 | 極めて自由だが、「CLAUDE.md」のような組み込みの規約はない |
| ツール | Service Definition → Provider → Consumer の capability seam | ツールサブシステムの標準化を徹底している |
| 環境 | sandbox/FS/Shell はすべて Provider を交換可能（リモート E2B を含む） | 環境が完全にプラグ可能 |
| 状態 | append-only Session Event Log + Model-visible means logged | 可観測性が第一原則 |
| フィードバック | tools/pre-execute 上の permission / guard / policy / hook | フィードバックメカニズムをイベント化している |

DeepSeek Harness とほかの3製品との根本的な違いは、Pi、Claude Code、Codex が「具体的な一つの agent」内部で harness を最適化するのに対し、DeepSeek Harness は harness を**モデルから独立した OS**として定義する点です。agent 自体は、この OS 上で交換可能なアプリケーションの一つにすぎません。代償も明確です。自由度が高いほど設定コストも高くなります。これは「harness を OS にする」という設計に固有のもう一つの側面です（Developer Preview の段階でも、「まず試してみるものであり、メカニズムはまだ進化中」と位置づけられています）。

## 参考にしたい設計

1. **ループの各段階をイベントポイントにする**：permissions、メモリ、ポリシー、ログを、ループ内にハードコードせず、リスナーとして接続します。
2. **capability seam を標準化する**：「具体的なツール」ではなく「能力インターフェース」に依存すれば、モデルから見えるツールのインターフェースに影響を与えず、環境全体を交換できます。
3. **Model-visible means logged**：モデルから見えるものをすべて記録し、可観測性を「追加の長所」ではなく「第一原則」にします。
4. **append-only の session log**：状態をリプレイ可能にし、ハンドオフを信頼できるものにします。「各 session の終了時にクリーンな状態を残す」ことをエンジニアリングで保証します。

## 参考資料（原文 / ソースコード）

以下の原文またはソースコードから各主張を確認できるため、印象に基づく説明ではありません。

- **DeepSeek Harness 公式サイト**："Agent = Model + Environment + Tools + State" という製品定義、Developer Preview という位置づけ、`dsh` コマンド。<br/>https://deepseek.com/harness
- **deepseek-ai/deepseek-harness リポジトリ**（コマンド `dsh`、MIT ライセンス）：<br/>https://github.com/deepseek-ai/deepseek-harness
- **アーキテクチャドキュメント architecture.md**：この記事の最も重要な出典。"Every part of the product is a plugin"、"There is no privileged core to patch"、Turn flow の event pipeline、Capability seams の3層の役割、"Model-visible means logged" と runtime invariant、append-only Session Event Log、fs/tools/telemetry などの capability seam と `ctx.*` サブシステム。<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **アーキテクチャドキュメント · 関連ドキュメント**：Cordis コアの概要（plugins contribute services, typed events, reversible effects）、capability seam の詳細、Session サブシステム。<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

関連講義：[講義11 · エージェントの動作を可観測にする](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [講義12 · すべてのセッションでクリーンな状態を残す](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [講義02 · Harness とは実際に何か](../../lectures/lecture-02-what-a-harness-actually-is/)
