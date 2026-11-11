# Pi の harness 設計を読み解く

[Pi](https://pi.dev/)（npm パッケージ `@earendil-works/pi-coding-agent`）は、自らを "minimal agent harness"、つまり最小限の agent harness と称しています。この表現は分解して読む価値があります。「最強の coding agent」とも「最も使いやすい AI コーディングツール」とも名乗らず、**harness** という言葉に自らの位置づけを明確に定めているからです。

この記事では、講義の5つのサブシステム（指示、ツール、環境、状態、フィードバック）のフレームワークを使って Pi を読み解き、その設計思想が Claude Code や Codex と根本的にどう異なるかを見ていきます。先に答えを示すと、**Pi の思想は「コアの最小化 + 拡張のプログラム可能化」です。コンテキストエンジニアリングを system prompt の外側まで広げ、Pi が harness を決めるのではなく、利用者（さらには Pi 自身）が harness を変更できるようにします。**

## 一言で表すと

Pi は最小限のコアです。公式の位置づけでは、意図的にコアを小さくし、決定権を利用者へ戻しています。[pi.dev のホームページ](https://pi.dev/)には、"Ask Pi to build what you want, or install a package that does it your way" とあります。Pi は、harness を4層のカスタマイズ可能な要素に分けています。

- **Extensions**：Pi のライフサイクルイベントに接続する TypeScript hooks。runtime レベルのプログラム可能なインターフェースです。
- **Skills**：指示とツールを含み、オンデマンドで読み込まれる能力パッケージです。progressive disclosure を採用しています。
- **Prompt templates**：再利用可能な Markdown prompt で、`/name` と入力すると展開できます。
- **Themes**：TUI の外観です。

この階層化の考え方自体が、一つの harness 設計です。**「モデルに何を見せるか、いつ見せるか」を、コアへハードコードせず、ルールと拡張へ完全に委ねています。**

## 中核ループ

Pi は、ほかのすべての coding agent と同様、本質的には「推論 → ツール実行 → 観察 → 再推論」という while ループです。注目すべきなのはループ自体ではなく、Pi がループの外側をどう扱うかです。コンテキスト管理を、ループ内部での「compaction」から、ループ外部での「制御」へと拡張しています。

Pi の runtime は、外部にプログラム可能なインターフェースを公開しています。[ソース README の Programmatic Usage](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)によると、対話型 TUI に加えて、スクリプト化された print/JSON モード、RPC プロトコル、SDK への組み込みにも対応しています。これにより、同じ harness を人間が一つずつ操作することも、CI/CD や別のプログラムが自動操作することもできます。これは講義13「ループエンジニアリング」の「手動駆動から自動ループへ」の前提に対応します。人間の対話でしか操作できない harness は、決して自動ループへ移行できません。

## 指示サブシステム：AGENTS.md と SYSTEM.md

Pi の「指示」の扱いは抑制的ですが、階層は明確です。

- **AGENTS.md**：[ソース README の Project Context Files](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)には、読み込み順序が明記されています。グローバルの `~/.pi/agent/AGENTS.md` → 親ディレクトリを上へ順にたどる → 現在のディレクトリの `./AGENTS.md` です（CLAUDE.md にも対応）。これは「リポジトリを唯一の事実源にする」という原則の実践です。指示はチャット欄での念押しではなく、ファイルとして存在します。
- **SYSTEM.md**：[pi.dev 公式ドキュメント](https://pi.dev/docs/usage/project-context)によると、プロジェクト単位でデフォルトの system prompt を置き換える（replace）か、追記する（append）ことができます。これは Pi が「system prompt」の変更を許可する唯一の公式インターフェースであり、「環境の自己記述」層でもあります。

Pi 公式は、system prompt 自体が**最小限**であることを強調しています。その背後には明確なトレードオフがあります。コアに「もし……なら……」という長大なルールを詰め込まず、拡張点を用意し、ルールが必要なときだけ Skills や Extensions として現れるようにするのです。これは講義04「単一の巨大な指示ファイルが失敗する理由」と直接対応しています。Pi は「最小限のコア + ファイル分割 + オンデマンド読み込み」によって、巨大な指示ファイルの問題を自然に回避しています。

## 状態とコンテキスト：Pi が最も細かく分解した領域

Pi のコンテキストエンジニアリングは、重点的に見る価値があります。講義で扱った「コンテキスト継続性」「コンテキストの劣化を防ぐ」といった概念を、具体的なメカニズムへ落とし込んでいるからです。

**1. Compaction をプログラム可能にする。** コンテキスト上限に近づくと、古いメッセージを自動的に要約します。[pi.dev 公式ドキュメント](https://pi.dev/docs/usage/sessions)によると、compaction 戦略自体を**カスタマイズ可能**です。Extensions を使って、トピック単位の compaction、コードを認識した要約を実装でき、要約用に別のモデルを使うことさえできます。ソース README にはデフォルトの仕組みの詳細もあります。自動 compaction は2つの場合（コンテキストオーバーフローからの復旧／保持しきい値の超過）に発動し、分割点より後の直近約2万 token を保持します。それより前のメッセージは "context handoff" に要約され、段階的に連鎖して compaction されます。つまり Pi は、「どう compaction するか」を変更不能な定数ではなく、harness の一部として扱っています。

**2. Dynamic context。** [pi.dev 公式ドキュメント](https://pi.dev/docs/usage/extensions)によると、Extensions は各推論の前にメッセージを注入し、メッセージ履歴をフィルタリングし、RAG を実装し、長期メモリを構築できます。「コンテキストが満杯になったら compaction する」より一歩進み、情報がコンテキストウィンドウへ入る前に、何を入れ、何を入れないかを決められます。講義の「agent の実行プロセスを観察・デバッグ可能にする」「コンテキスト継続性を保つ」に対応し、Pi はこの2つを拡張インターフェースへ移しています。

**3. Session tree。** [pi.dev のホームページ](https://pi.dev/)には、"sessions are stored as trees" と明記されています。`/tree` で履歴上の任意のノードへ戻って続行でき、すべての分岐が同じファイルに保存されます。これは講義が繰り返し強調する「session をまたぐコンテキストの断絶」を解決します。要約だけで無理につなぐのではなく、構造化された履歴のリプレイを使います。分岐は HTML にエクスポートしたり、gist へアップロードして共有したりできるため、可観測性も同時に確保されます。

## ツールサブシステム：Skills と Extensions

Pi の「ツール」は2層に分かれています。

- **Skills**：[ソース README の Skills セクション](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)では、"self-contained capability packages that the agent loads on-demand"、つまり agent がオンデマンドで読み込む自己完結型の能力パッケージと明確に定義されています。指示とツールを含み、Agent Skills 標準に準拠します。progressive disclosure により、Skill の詳細はトリガーされたときだけコンテキストへ入り、**prompt cache を圧迫しません**。これはコストの観点からの harness 設計です。コンテキストの token が1つ増えるたびに、推論ごとにそのコストがかかります。Skills をオンデマンド読み込みにすることは、「説明書ではなく地図を渡す」という原則の別表現です。
- **Extensions**：組み込みのライフサイクルイベントに接続する TypeScript hooks です。[ソース README の Hooks セクション](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)には、公式の用途例として、危険なコマンドの阻止（permissions のゲート）、タスク切り替え時のコード状態の checkpoint、パスの保護（`.env` などへの書き込み禁止）、モデルへ渡す前のツール出力の変更、外部（ファイル監視／Webhook／CI）からのメッセージ注入による agent の起動が挙げられています。これらの hooks API は `@mariozechner/pi-coding-agent/hooks` からもエクスポートされています。コミュニティの harness（[pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)）は、hooks のインターフェースをさらにラップし、skill-router、session-summary、extract-patterns、telemetry など、すぐに使える Extensions を提供しています。

Extensions は Pi における最も重要な設計判断です。**単に「いくつかの設定スイッチをユーザーへ渡す」のではなく、runtime 内部のイベントインターフェースをすべて公開しています。** メモリを追加したいなら、`agent/pre-step` で注入します。動作を記録したいなら、session イベントを購読します。モデルへのリクエストを変更したいなら、`agent/request` に hook します。Pi に自分自身の harness を変更させることもできます。これはどのような「設定項目」よりも、「プログラム可能な harness」という定義に近いものです。

## フィードバックと検証：「学習」も harness にする

Pi 自体には、強制的なテストゲートは組み込まれていません（検証コマンドは利用者が AGENTS.md に記載します）。しかし、コミュニティの harness（[pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)）は、Extensions により「フィードバックループ」を構造化しています。公式 README の Hooks セクションにも、類似メカニズムの基盤が示されています。

- **session-summary**（pi-agent-harness の Extension）：`PROGRESS.md` のローリングエントリを維持します。これは講義における状態サブシステムであり、長いタスクの進捗追跡です。
- **extract-patterns**（pi-agent-harness の Extension）：session から教訓の候補を集め、`LESSONS.md` へ蓄積します。「各 session の終了前にハンドオフを整える」ことを、約束事からメカニズムへ変えます。
- **telemetry**（pi-agent-harness の Extension）：token 使用量やコストなどを記録し、可観測性を提供します。

同じコミュニティリポジトリは、このパターンをさらに実証しています。`VISION.md`（目標）、`PROGRESS.md`（進捗）、`LESSONS.md`（教訓）、`STANDARDS.md`（標準）は、すべて Markdown ファイルとして session をまたいで永続化されます。これは講義が推奨する「リポジトリを唯一の事実源にする + 進捗ファイル + ハンドオフメカニズム」とまったく同じパターンですが、Pi の拡張メカニズムによってすぐに使える層になっています。

## 講義のフレームワークへのマッピング

講義の5つのサブシステムで Pi を評価します（主観的な評価であり、比較用です）。

| サブシステム | Pi の実装 | 評価 |
| --- | --- | --- |
| 指示 | AGENTS.md の階層的読み込み + SYSTEM.md | 階層は明確だが、ルール自体はユーザーが書く必要がある |
| ツール | Skills のオンデマンド読み込み + Extensions の全ライフサイクル hooks | 非常に強力。ツールシステムをプログラム可能なインターフェースにしている |
| 環境 | SYSTEM.md で環境を自己記述。runtime 環境はユーザーが AGENTS.md に宣言 | メカニズムは開かれているが、再現性はユーザーの自己記述に依存する |
| 状態 | session tree + カスタマイズ可能な compaction + PROGRESS.md | 非常に強力。session をまたぐ継続性と復元性が中核 |
| フィードバック | 検証コマンドはユーザーが定義。session-summary / extract-patterns でメカニズム化 | メカニズムは提供され、内容はユーザーに委ねられる |

Pi のトレードオフは、Claude Code / Codex と鮮明な対照をなします。Claude Code は「メモリ、permissions、subagent」をコアへ組み込み、すぐに使えるようにしています。Codex は「リポジトリ規約、環境分離」をデフォルトにしています。Pi は、**何も代わりに決めない**ことを選び、決定権を拡張点にしています。その代わり、自分で Extensions を書くか、他者のパッケージをインストールする必要があります。

## 参考にしたい設計

1. **compaction 戦略をプラグ可能にする**。harness における「コンテキストをどう compaction するか」は、ハードコードされたパラメータではなく、交換可能な戦略インターフェースにすべきです。
2. **硬い要約の代わりに session tree を使う**。session をまたぐ復元は、必ずしも「前回の要約」に頼る必要はありません。構造化された履歴のリプレイのほうが、状態サブシステムとして信頼できる場合があります。
3. **prompt cache を意識する**。Skills をオンデマンドで読み込み、すべてのルールを一度に system prompt へ詰め込まないことは、コンテキストエンジニアリングであると同時に、コストエンジニアリングでもあります。
4. **agent が自分の harness を変更できるようにする**。harness の拡張インターフェースが十分に開かれていれば、「agent の動作を最適化する」こと自体を agent が半自動で行えます。

## 参考資料（原文 / ソースコード）

以下の原文またはソースコードから各主張を確認できるため、印象に基づく説明ではありません。

- **pi.dev 公式サイト**："Ask Pi to build what you want, or install a package that does it your way" という位置づけ、4層のカスタマイズ可能な要素、session tree（"sessions are stored as trees"、`/tree`、単一ファイルへの保存、HTML へのエクスポート / gist での共有）。<br/>https://pi.dev/
- **pi.dev 公式ドキュメント · Sessions**：プラグ可能な compaction（topic-based / code-aware / 要約モデルの変更）、自動 compaction と dynamic context 注入のメカニズム。<br/>https://pi.dev/docs/usage/sessions
- **pi.dev 公式ドキュメント · Extensions**：各推論前のメッセージ注入、履歴のフィルタリング、RAG、長期メモリの構築。<br/>https://pi.dev/docs/usage/extensions
- **pi.dev 公式ドキュメント · Project Context**：SYSTEM.md の replace / append のセマンティクス。<br/>https://pi.dev/docs/usage/project-context
- **Pi Coding Agent ソース README**（badlogic/pi-mono）：AGENTS.md の3段階の読み込み順序（グローバル → 親ディレクトリ → 現在のディレクトリ）、`/compact` と自動 compaction の発動条件および2万 token の分割点、Skills のオンデマンド読み込みと Agent Skills 標準、Hooks のライフサイクルと公式の用途例、Programmatic Usage（JSON / RPC / SDK）。<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **pi-agent-harness コミュニティリポジトリ**：skill-router / session-summary / extract-patterns / telemetry Extensions、VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md のファイル体系。<br/>https://github.com/LabidySabidy/pi-agent-harness

関連講義：[講義02 · Harness とは実際に何か](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [講義05 · セッションをまたいでコンテキストを保つ](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [講義13 · 手動駆動から自動ループへ](../../lectures/lecture-13-loop-engineering/)
