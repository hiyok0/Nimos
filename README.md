# Nimos
## これは何？
　棒読みちゃんのHTTP形式でのリクエストを代わりに受け取ろうとするもの。とりあえずVOICEVOXで合成している。 

　想定環境は特に無いけどとりあえずmacとか(?)

### Screenshots
![nusuttoChan screenshots at e85d6f9](https://i.imgur.com/34qPo39.png)
開発し始めたばかりのため見た目が大幅に変わる可能性もあります。

## 使い方
　詳しい使い方はそのうちどこかに書くかもしれないけど、とりあえずnode環境無い人いたら以下の動画（YouTube）おすすめかもしれない。

* for macOS or Linux users--> [Node.jsをインストールしよう！ Mac & Linux 編 [Beginner's Series to Node.js 2/26] by  クラウドデベロッパーちゃんねる
](https://youtu.be/ySQoRMeUIE8)
	* WSLとかもこっち
* for Microsoft Windows lovers-->[Node.jsをインストールしよう！ Windows 編 [Beginner's Series to Node.js 3/26] by クラウドデベロッパーちゃんねる](https://youtu.be/06SMdezk8Nc)

あとはこのリポジトリをクローンするなりzipでDLするなりして、
```bash
npm ci #初回のみ
npm run start #そのまま動かす場合
npm run make   #ビルドする場合
```
【破壊】話者やポートの指定がコマンドラインからできなくなっています。待受ポートはそのうちまた指定できるようにするつもり。


## やることリスト
[Projects](https://github.com/orgs/hiyok0/projects/1/views/1)へ移行
