# 日本語リソースライブラリ

このフォルダは、コースで扱う方法を、実際のリポジトリで使えるコピー可能なテンプレートと短いリファレンスに変換したものです。

## いつ使うか

Codex、Claude Code、その他のコーディングエージェントに、セットアップ、進捗、スコープを毎回推測させず、複数セッションにわたって作業させたいときはここから始めます。

特に次のような場合に役立ちます。

- 作業が複数セッションにまたがる
- 機能が多く、途中で放置されやすい
- エージェントが早すぎる完了宣言をしがち
- 起動手順を毎回探し直している

## 最初に使うもの

最小構成では、次から始めます。

- ルート指示: [`templates/AGENTS.md`](./templates/AGENTS.md) または [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- 機能状態: [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- 進捗ログ: [`templates/claude-progress.md`](./templates/claude-progress.md)
- ブートストラップスクリプト参照: `docs/ja/resources/templates/init.sh`

次に追加します。

- セッション引き継ぎ: [`templates/session-handoff.md`](./templates/session-handoff.md)
- クリーン終了チェックリスト: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- 評価ルーブリック: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

OpenAI の "Harness engineering" 記事に近い、より本格的なリポジトリ構造が必要な場合は、高度なパックを使います。

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## ライブラリ構成

- [`templates/`](./templates/index.md): 実際のリポジトリにコピーするテンプレート
- [`reference/`](./reference/index.md): 方法メモ、起動フロー、失敗モードのマップ
- [`openai-advanced/`](./openai-advanced/index.md): 高度なリポジトリ雛形、system-of-record ドキュメント、agent-first ガバナンステンプレート

## 推奨される最小パック

- `AGENTS.md` または `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

この 4 つのファイルだけでも、多くのエージェントワークフローは目に見えて安定します。

リポジトリが複数ドメイン、アクティブな計画、品質スコア、信頼性ポリシーを持つ長期運用システムに育ったら、最小パックを無理に拡張するのではなく、[`openai-advanced/`](./openai-advanced/index.md) パックへ移行してください。
