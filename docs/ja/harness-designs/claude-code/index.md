# Claude Code の harness 設計を読み解く

Anthropic は『[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)』で、信頼性の源泉はモデルではなく harness であり、agent は「モデルの外側」で制約される必要があると明確に述べています。Claude Code は、この考え方を製品化した例であり、Anthropic 公式も直接 **agentic harness** の一種に位置づけています。これはマーケティング上の表現ではありません。Claude Code は、現在公開されている中で最も詳細に分析された harness の一つでしょう。ソースコードが公開され、コミュニティの調査レポートも詳しく、講義に登場するほぼすべての中核メカニズム（階層化メモリ、コンテキストの compaction、permissions、hooks、subagent、session の永続化）が、完全に製品化されています。

この記事では、講義の5つのサブシステムのフレームワークを使って Claude Code を読み解き、「コンテキスト管理」「早すぎる完了宣言の防止」「決定論的な制約」といった harness の原則を、どう実装しているかに注目します。

## 一言で表すと

Claude Code の中核は、モデルを呼び出し、ツールを実行し、結果を観察し、再びモデルを呼び出すという単純な while ループです。しかし、**コードの大部分はこのループ内ではなく、それを取り巻くシステムにあります**。permissions システム、コンテキスト compaction pipeline、拡張メカニズム、subagent のオーケストレーション、session ストレージです。これこそ harness の本質です。ループは骨格にすぎず、信頼性を決めるのは骨格の外側にあるすべてです。

## 指示サブシステム：階層化メモリ体系

Claude Code のメモリシステムは、harness 理論に対する最も直接的な貢献であり、講義の「リポジトリを唯一の事実源にする」と「session をまたぐコンテキスト継続性」に対応します。[公式ドキュメント『How Claude remembers your project』](https://code.claude.com/docs/en/memory)には、各 session はまっさらなコンテキストウィンドウから始まり、2種類のメカニズムによって session をまたいで知識を持ち越すと明記されています。CLAUDE.md ファイル（ユーザーが書く指示）と auto memory（Claude 自身が書くメモ）です。

scope について、公式は CLAUDE.md ファイルを4種類に分類しています（読み込み順が広いものから狭いものへ）。

- **組織ポリシーレベル**：IT/DevOps が一元管理する（例：`/etc/claude-code/CLAUDE.md`）企業レベルの規約です。
- **ユーザーレベル `~/.claude/CLAUDE.md`**：プロジェクトをまたぐ個人の好みとルールです。
- **プロジェクトレベル `./CLAUDE.md` または `./.claude/CLAUDE.md`**：プロジェクトレベルの事実源であり、プロジェクト構造、技術スタック、検証コマンドを記載し、リポジトリで共有します。
- **ローカルレベル `./CLAUDE.local.md`**：プロジェクト内での個人的な好みを記載し、通常は `.gitignore` に追加して commit しません。

さらに、2つのメカニズムがあります。

- **サブディレクトリ単位のオンデマンド読み込み**：サブディレクトリ内の CLAUDE.md は起動時には読み込まれず、Claude がそのディレクトリのファイルを読むときに初めてコンテキストへ入ります。
- **auto memory**：Claude がユーザーの修正や好みに基づいて自発的にメモを書きます。リポジトリ単位で共有され、worktree をまたいで有効になり、各 session では先頭200行または25KBまで読み込まれます。

この4種類の scope が、**指示の階層**を構成します。公式ドキュメントによると、「具体的な指示ほど後からコンテキストへ入る」ため、プロジェクトの指示はユーザーの指示より後に現れます。その価値は、各対話の冒頭で一つの巨大な指示ファイルをモデルに読ませるのではなく、scope に応じて最も近いものを読み込むことにあります。これは講義04「単一の巨大な指示ファイルが失敗する理由」に対する製品レベルの回答です。

## コンテキストサブシステム：5段階の compaction pipeline

Claude Code のコンテキスト管理は、単なる「満杯になったら要約する」仕組みではなく、**5段階の compaction pipeline**（five-layer compaction pipeline）です。このアーキテクチャの詳細は、[VILA Lab の『Dive into Claude Code』](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)によるソースコードレベルの分析に基づきます。講義05では「長いタスクは継続性を失う」と説明しました。Claude Code の解決策は多段階の漏斗です。まず可逆的な pruning（冗長なツール結果を取り除く）を行い、次に構造化して抽出し、最後に初めて不可逆的な LLM 要約を使います。また、過度な compaction を防ぐ circuit breaker も備えています。

これを支えるのが session ストレージの設計です。**追記型 session ストレージ（append-oriented storage）**として、すべての履歴を `history.jsonl` へ追記し、`/resume` による復元と fork 分岐をサポートします。これにより、「各 session の終了前にハンドオフを整える」ことが保証されます。記憶力が高いからではなく、ストレージ層が追記型でリプレイ可能だからです。

## ツールサブシステム：4種類の拡張メカニズム

Claude Code は拡張インターフェースを4種類に分け、それぞれが異なる問題を解決します。これは設計上、最も参考にしたい部分です。

- **Skills**：[公式ドキュメント](https://code.claude.com/docs/en/skills)では、`SKILL.md` で記述する手続き的知識と定義されています。トリガーワードによって自動的に読み込まれ、progressive disclosure を採用します。「何かをどう行うか」というドメイン知識に適しています。
- **MCP**：[公式ドキュメント](https://code.claude.com/docs/en/mcp)にある JSON-RPC プロトコルで外部システムへ接続します。「モデルの手を外部世界へ届かせる」ための標準インターフェースです。
- **hooks**：[公式ドキュメント](https://code.claude.com/docs/en/hooks)にある、`PreToolUse`、`PostToolUse`、`Stop` などのライフサイクルイベントへ接続する決定論的なスクリプトです。
- **plugin / subagent**：[公式ドキュメント](https://code.claude.com/docs/en/sub-agents)にある、複雑なタスクを専門化した agent へ分割して実行する仕組みです。

重要な設計は、**責務の分離**です。CLAUDE.md は「何であるか」、Skills は「どう行うか」、MCP は「どこへ接続するか」、hooks は「いつ強制するか」を担います。チームがこれらの層を混同すると（たとえば MCP が担うことを CLAUDE.md に書くと）、講義で述べたコンテキスト漏れが起きます。

## フィードバックと検証：決定論的な制約 + 人間と機械の分業

講義10では、「完全なフローを実行して初めて本当に検証したと言える」と説明しました。Claude Code は2つの経路でこれに対応します。

**1. permissions システム（決定論的な制約）。** Claude Code の permissions は「すべてを一度ずつ確認する」仕組みではなく、7種類のモードと ML ベースの分類器です。低リスクな操作は許可し、高リスクな操作はポリシーに従って確認または拒否します（アーキテクチャの詳細は [VILA Lab の分析](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)を参照）。講義07の「agent に境界を明確にする」を、prompt でお願いするのではなく、runtime で強制しています。

**2. hooks（早すぎる完了宣言の防止）。** `PostToolUse` hook はツール実行後にチェックを強制し、その結果をコンテキストへ書き戻せます。`Stop` hook は agent が完了を宣言するときに介入します。これは「作業する者とチェックする者を分ける」設計です。[Anthropic は harness の記事で](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)、agent が自信満々に自らの成果を称賛する（"confidently praised their work"）と明確に観察しています。そのため、モデルの自己評価を信頼せず、hooks で**決定論的な**チェックを注入します。

**3. subagent（コンテキストの分離）。** 各 subagent の対話記録は独立した sidechain ファイルに保存され、**親 agent のコンテキストを膨張させません**（[VILA Lab の分析](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)を参照）。これは「タスク境界」と「コンテキスト分離」の組み合わせです。タスクを分けると同時に、コンテキスト汚染も分離します。

## 可観測性と session の永続化

Claude Code のログは追記型の完全な記録（history.jsonl）です。さらに `/compact`、`/clear`、`/init` という明示的なコマンドにより、コンテキストが満杯になるまで受け身で待つのではなく、状態を能動的に管理できます。`/init` は「agent が作業前に毎回初期化する」（講義06）という考え方を、一つのコマンドにしています。[公式ドキュメント](https://code.claude.com/docs/en/memory)によると、コードベースを自動分析し、ビルドコマンド、テスト手順、プロジェクト規約を含む最初の CLAUDE.md を生成します。

## 講義のフレームワークへのマッピング

| サブシステム | Claude Code の実装 | 評価 |
| --- | --- | --- |
| 指示 | scope の階層化（組織/ユーザー/プロジェクト/ローカル）+ auto memory | 階層化メモリの模範的な実装 |
| ツール | Skills + MCP + hooks + subagent の4種類の拡張 | 責務の分割が明確で、中核的な強み |
| 環境 | プロジェクト内の設定 + settings.json | CLAUDE.md でユーザーが自己記述する |
| 状態 | 追記型 session ストレージ + 5段階の compaction + resume/fork | 非常に強力。長いタスクの継続性における参考実装 |
| フィードバック | permissions 分類器 + PostToolUse hook による強制チェック | 「早すぎる完了宣言の防止」を決定論的な仕組みにしている |

## 参考にしたい設計

1. **指示を一つのファイルに積み上げず、scope ごとに階層化する**。ディレクトリ単位の CLAUDE.md は、「近くで読み込む」美しい実装です。
2. **compaction は段階的な漏斗にする**。最初に可逆的な処理を行い、その後に不可逆的な処理を行います。最初から全文を要約してはいけません。
3. **hooks で決定論的なチェックを行う**。早すぎる完了宣言を防ぐには、prompt でお願いするのではなく、runtime で強制します。
4. **subagent のコンテキストを分離する**。タスクと同時にコンテキストも分割し、subtask の結果でメインループを汚染させないようにします。
5. **session ストレージを追記型かつリプレイ可能にする**。ハンドオフは記憶に頼らず、ストレージ層で保証します。

## 参考資料（原文 / ソースコード）

以下の原文またはソースコードから各主張を確認できるため、印象に基づく説明ではありません。

- **Claude Code 公式ドキュメント · Memory**：各 session のまっさらなコンテキスト、CLAUDE.md の4種類の scope、サブディレクトリ単位のオンデマンド読み込み、auto memory（200行 / 25KB）、`/init` による CLAUDE.md の生成。<br/>https://code.claude.com/docs/en/memory
- **Claude Code 公式ドキュメント · Skills / MCP / Hooks / Sub-agents**：4種類の拡張メカニズムとイベント（PreToolUse / PostToolUse / Stop）の定義。<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab『Dive into Claude Code』**（ソースコードレベルの分析レポート）：5段階の compaction pipeline、permissions の7モード + ML 分類器、sidechain subagent、追記型 session ストレージ history.jsonl。<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic『Effective harnesses for long-running agents』**：「信頼性はモデルではなく harness に由来する」、agent は自信満々に自らの成果を称賛する、hooks で検証を行うといった見解の出典。<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Claude Code Full Stack ガイド**（コミュニティ、CLAUDE.md / Skills / MCP / Subagents / Hooks の階層）：拡張メカニズムの責務分離に関する補足資料。<br/>https://jsmanifest.com/claude-code-full-stack-guide

関連講義：[講義03 · リポジトリをシステムの記録にする](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [講義09 · エージェントの早すぎる勝利宣言を防ぐ](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [講義10 · エンドツーエンドテストが結果を変える理由](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
