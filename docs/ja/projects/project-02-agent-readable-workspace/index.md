[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> 関連講義: [講義 03. リポジトリを唯一の信頼できる情報源にする](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [講義 04. 指示を複数ファイルに分ける](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> テンプレートファイル: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/ja/resources/templates/)

# プロジェクト 02. プロジェクトを読みやすくし、中断地点から再開できるようにする

## やること

新しいエージェントがプロジェクト構造、現在の進捗、次にやるべき作業をすばやく理解できるよう、リポジトリに「読みやすさ」を追加します。具体的には、ドキュメントのインポート、詳細表示、ローカル永続化を 2 セッションに分けて実装します。

`starter/` の同じコードから 2 回実行します。1 回目は starter 標準の簡素なハーネスを使い、`session-handoff.md` は作りません。2 回目は `solution/` の引き継ぎルール付き `AGENTS.md` を使い、セッション A の終わりに `session-handoff.md` を作ります。どちらも 2 セッションに分け、後半のセッションが前半のやり残しを引き継ぎます。コード、プロンプト、エージェント、セッション A の終了条件をそろえ、`AGENTS.md` のルールと引き継ぎメモを合わせたハーネスの違いを比較します。

## ツール

- Claude Code または Codex
- Git
- Node.js + Electron

## Harness メカニズム

エージェントが読めるワークスペース + 永続化された状態ファイル

## リポジトリ内のプロジェクトを使う

リポジトリ内のパス: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| ディレクトリ | 含まれるもの | 比較すること |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Project 01 のコードに、未完成のドキュメント import、詳細ビュー、永続化が入っています。ドキュメントはありますが薄く、`session-handoff.md` はありません。 | 2 回目のエージェントセッションがどれだけ再探索するか。 |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | 同じプロダクト範囲が完成しており、[`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) 配下に引き継ぎ用ドキュメント、[`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json)、[`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) があります。 | 新しいセッションがリポジトリ状態だけで再開できるか。 |

`solution/` は参照用であり、実行の開始地点ではありません。強いハーネス側で使うのは、このディレクトリの `AGENTS.md` のみです。

## 実行手順

2 回の実行で変えるのはハーネスだけです。コード、タスクプロンプト、エージェント、セッション A の終了条件は同じにします。[プロジェクトの README](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md) と同様、セッション A ではドキュメントのインポートと詳細表示、セッション B では永続化を扱います。

1. `p02-baseline/` と `p02-improved/` など、互いに隔離した作業ディレクトリを 2 つ用意します。同時には実行せず、片方の 2 セッションを終えたら結果を保存し、その作業ディレクトリを削除してからもう片方を始めます。Git ブランチで実行を分けないでください。コーディングエージェントは別ブランチや同じ階層のディレクトリを読めるため、弱いハーネス側から強いハーネス側のファイルが見えると公正に比較できません（Project 01 と同じルールです）。
2. 両方に [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) をコピーします。Project 01 の解答をもとにしているので、Project 01 の機能は検証済みで、Project 02 の 3 機能は `feature_list.json` で `not-started` になっています。自分で完成させた Project 01 を使う場合は、同じスナップショットを両方にコピーします。重要なのは開始時のコードが同一であることです。
3. 両方に同じタスクプロンプトを使います。例：「ファイル選択画面からドキュメントを取り込めるようにし、詳細ビューに全文を表示してください。また、アプリを再起動しても取り込んだドキュメントが残るようにしてください。」
4. `solution/docs/`、`solution/feature_list.json`、`solution/session-handoff.md` はどちらにもコピーしません。完成済みのインポートとコンテンツ取得の流れが記載され、全機能が `pass` になっており、解答を渡すことになるからです。両方とも starter の `docs/ARCHITECTURE.md`、`docs/PRODUCT.md`、`feature_list.json` をそのまま使います。

### 1 回目（弱いハーネス）

`p02-baseline/` では、starter の短い `AGENTS.md`、`docs/`、`feature_list.json` をそのまま残し、`session-handoff.md` は作りません。元のファイルを削除しないでください。「弱い」は「最小限」であって「空」ではありません。

**セッション A：**

1. タスクプロンプトでエージェントを起動します。
2. インポートと詳細表示が動作し、永続化が未完成の時点で自分でセッションを止めます。動作の確認は、アプリを起動し、ファイル選択画面で `.txt` または `.md` ファイルを取り込み、一覧に表示され、開くと全文が見えることです。ただし再起動すると取り込んだドキュメントは失われます。2 回目も同じ条件で止めます。
3. 引き継ぎメモやその他の要約ファイルの作成は依頼しません。

**セッション B：**

1. 同じディレクトリで新しいエージェントセッションを開き、「作業を続けてください」とだけ伝えます。
2. 最初の有意義なコード変更までの時間と、セッション A で判明済みの情報（構造、コマンド、途中まで実装した機能など）を調べ直した回数を記録します。

### 2 回目（強いハーネス）

`p02-improved/` では、セッション A の前に `AGENTS.md` を [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md) に差し替えます。起動時のルール、ドキュメントの優先順位と更新ルール、`feature_list.json` に証拠を記録する完了条件、セッションの引き継ぎルールが追加されています。それ以外のファイルは変えません。`AGENTS.md` の変更は引き継ぎに限られないため、比較しているのはハーネス全体であり、セッション B の差をメモだけの効果とは言えません。引き継ぎだけを検証するなら、3 回目に starter の `AGENTS.md` へ引き継ぎの節だけを追加します。

**セッション A：**

1. 同じタスクプロンプトでエージェントを起動します。
2. 1 回目と同じ時点で止めます（インポートと詳細表示は動作、永続化は未完成）。
3. 終了前に、[引き継ぎテンプレート](./../../resources/templates/session-handoff.md) に沿って、確認済みのこと、変更点、壊れているか未確認の部分、次に優先する作業を、エージェントにリポジトリのルートの `session-handoff.md` に書かせます。[完成例](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) は全機能が完了した状態なのでコピーしません。

**セッション B：**

1. 同じディレクトリで新しいエージェントセッションを開き、「作業を続けてください」とだけ伝えます。`session-handoff.md` を読む指示はプロンプトではなく `AGENTS.md` に含まれます。
2. 1 回目と同じ指標を記録します。

## 結果の測り方

| 指標 | 説明 |
|------|------|
| セッション B の着手時間 | 開始から最初の有意義なコード変更までの時間 |
| 再調査の回数 | エージェントが既知の構造、コマンド、状態などを調べ直した回数 |
| 引き継ぎの品質 | メモが網羅的かつ正確で、次の作業に使えるか（2 回目のみ） |
| 重複作業 | セッション B でセッション A の完了済み作業をやり直した量 |
| 最終的な完了状況 | 3 機能をすべて実装できたか |

## 提出物

- 弱いハーネスの実行記録：セッション A・B の会話記録またはログ
- 強いハーネスの実行記録：同じログに加え、使用した `AGENTS.md` とエージェントが書いた `session-handoff.md`
- 比較メモ：着手の速さとコンテキスト復元の質
