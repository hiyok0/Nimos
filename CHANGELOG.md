# Changelog
Some notable changes to this project may be documented in this file.

## Unreleased
VOICEVOX表記でなく、VOICEVOX系なら何でも使える的な表記に
有名なポート番号は手打ちでなくても使えるように
複数の音声を設定できるように

## v0.0.15
パッケージのアップデート（2024年8月23日）

## v0.0.14
パッケージのアップデート（2024年2月24日）

## v0.0.12
***`/GetVoiceList`* の応答JSONの形式が間違っていたのを修正**
内部パッケージのアップデート（2023年4月18日）

## v0.0.11
パッケージのアップデート（2023年3月12日 アプデ漏れ）
* http-cache-semantics

## v0.0.10
パッケージのアップデート（2023年3月12日）
設定画面に本体バージョンを仮追加
* 最終的には常に決まった位置に出るようにしたい。
その他軽微なUI改善

## v0.0.9
デフォルトのポート番号をlocalhostから127.0.0.1に
* 一部環境で正常動作していなかったので対応

## v0.0.8
話速とかを反映させるのを実装し忘れてたのを修正

## v0.0.7
内部バージョンのアップデート（axios）
electron-nightlyはアプデするとなぜか動かなくなるのでとりあえず保留

## v0.0.6
VOICEVOXが見つからないときに設定画面がなかなか開けなかったのを修正
パッケージのアップデート（2022年12月29日）

## v0.0.5
パッケージのアップデート（2022年11月22日）

## v0.0.4-1
workflowの修正

## v0.0.4
アイコンの設定忘れを修正

## v0.0.3
CHANGELOG.mdの書き忘れを訂正

## v0.0.2
パッケージをアップデート（2022年11月4日）
abputページの遷移を修正。

## v0.0.1
### 1st Release
Now on Release.

### Before Release
* 9776a44 upload-artifactのpath修正
* 3b787b8 upload-artifactの修正
* f939dd3 要らないプロセスを削除
* b6ea4b5 productNameへの修正し忘れを修正
* 702d2a4 nameだと思ったらproductNameだったのを修正
* 683ab0d nusuttochanが残っていたのを修正
* dc6312f 並列にしてたのを一旦止める
* bb84827 バージョン番号が正しく表示されていないのを修正
* 3341f3a リリース後のdiscordへの送信を設定
* e77448c faviconとapple-touch-iconの更新
* 123c53e デフォルトの話者を14-->3に
* b74c56e discordの紹介ページのURLを本物に置き換え
* 3f71630 空のworkflowファイルを削除
* 84ee66b 待受ポート変更に関する記述を変更
* 1b8964b READMEにnusuttoChanが残ってたので修正
* 00e920c 改名案の募集を終了
* 283e9ef README.mdのscreenshotをupdate
* e85d6f9 一部の外部リンクが内部ブラウザで開いてしまうのを修正
* 90b33a5 アプリ内の表示等もNimosに更新
* e566231 アイコンを更新
* c82fab5 改名nusuttoChan-->Nimos
* cba40a0 CHANGELOGの過去のコミット部分をリスト化
* 0ec74ff gh-action-auto-releaseに変更、CHANGELOG.mdを作成
* 4810096 workflowの名前を修正
* d20dc70 リリースに向けてアップデート
* b68b91f 何故か反映されてなかったtemplate.hbsのコミット
* 29781b8 Workflowでのライセンス表示の出力を調整
* 626666e 単位と初期値を追加
* 5d10922 聖徳太子モードと再生町の音声ファイル数を制限しようとした爪痕のみ
* 892666c linkのjson記法のミスを修正
* 5fca6be 報告のページを改修
* a7e48a7 トップ画面に表示される情報を増加
* ac29805 起動時のメッセージを更新
* 222dbb5 Web？ UIのトップ画面を改善
* f417a97 コミットできてなくて大きなコミットになってしまった
* a1d253e バグ報告・問い合わせを作成（Google Form以外）
* e715824 設定ファイルの保存と読み込みを実装、UIとかの軽微な修正と改善
* 93e231a versionを0.0.0に
* e03ea24 PORT指定のUI部分作成、軽微なUIの修正
* 7faff9a 設定の適用、/talkのvoice,speed,toneクエリに対応
* 05e2803 設定値の受け取りと設定画面の整備。軽微な修正
* 138332d /GetVoiceList対応
* c1ebf41 /speakersで+10000していたのを+0に。
* eb43c76 /talkでvoiceを指定可能に
* f29f7c6 /clearを実装＆productName設定の影響によりポート番号が表示されなくなっていたのを修正
* 44bd9b6 electron導入前の設定用の引数読み取り部分を削除
* 7487fff 不要不急のletを自粛
* efa48b6 About表示を修正
* 3abd7fc menu barを作成、productName作成
* 6325be4 スクリーンショットの埋め込みをimgurに
* ca83770 スクリーンショットを追加
* 5c4243d 情報が古くなっていたため更新
* f3c7281 WebUI周りの表示を改善
* cec2aa6 背景色関連変更＆iOSのステータスバーの背景色調整
* ea6645b ポート指定を高機能化
* e71a9b7 faviconとapple-touch-icon
* ea37fe6 アプリアイコンを追加＆設定
* 0ee1c52 srcだと不正確なのでmainに
* da735e8 ディレクトリ構成を変更
* ef33a48 設定項目追加と見た目改善
* 6794d75 トップページのアイコンと警告を整形
* 0425fa3 /speakersで取り敢えずなにか返すようにした
* 6dff232 /talkに投げたときに特定の文字列を返すように
* e4952d6 ビルドしたものも動くようにデフォルトのコマンドを直接指定に
* e2d4ad8 artifactへのpathを修正
* af21d14 Merge branch 'try-electron'
* 3beeaed github actions (electron)
* 646ee0f nexe用workflow削除
* afd2dcc ページ類の微整備（+aboutページ作成）
* 87a7e4c トップページを無駄に横長に表示することを考慮外に
* 46e7f2f electron-forge導入
* 7febe46 electronアプリ化
* 379ec32 WebUI風の何かを作った
* de4345d 軽微なリドミーの修正
* 3031535 開発状況に合わせてリドミーを更新
* b648fe4 UIが動作するところまで
* 835c9da cloneしてみる
* a1dcb16 github actions使ってみる
* dc860bd ブラウザでの操作画面製作開始（まだページは無し）
* 767bc9f listenPort無入力時にエラー扱いになるのを修正
* 903ab30 使い方書いた
* cb80933 合成リクエスト時にconsole.logするように
* 6424e6d 合成リクエスト時にconsole.logするように
* 7fe3d25 とりあえず動いた！！！！
* 3dac463 【不動】まだ動かない！！合成完了までは確認
* 30df121 app.get内をより簡潔に
* e3e1424 一回に一個ずつ再生を復活
* fc57c76 voicevoxの.query.processを.startに
* f7403e1 関数をまとめた。一個ずつ再生するのがなくなった。
* c9417ec よりスマートに
* b79ef4c README追記
* f96a5a7 １つずつ再生するようにした
* e004478 voicevoxのアドレスがあたおかになっていたのを修正
* a541601 引数の概念を追加
* 9cba258 VOICEVOX関連のプロセスをまとめた,設定値のオブジェクト名変更
* ae3d9cd vvAddr,vvVoice廃止,再生コマンドも変数に
* 123a965 vvAddr,vvVoiceを廃止
* 9baae8a vvAddrをlocalhostに修正
* e6960f9 本当のinitial commit
* 7ce165c Initial commit
