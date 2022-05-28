# nusuttoChan
怒られたら消すけど怒られない気もする。

良い改名案があったら提案ください。Twitter＠ Jewel_Flash
## これは何？
　棒読みちゃんのHTTP形式でのリクエストを代わりに受け取ろうとするもの。とりあえずVOICEVOXで合成している。 

　想定環境は特に無いけどとりあえずmacとか(?)

## 使い方
　詳しい使い方はそのうちどこかに書くかもしれないけど、とりあえずnode環境無い人いたら以下の動画（YouTube）おすすめかもしれない。

* for macOS or Linux users--> [Node.jsをインストールしよう！ Mac & Linux 編 [Beginner's Series to Node.js 2/26] by  クラウドデベロッパーちゃんねる
](https://youtu.be/ySQoRMeUIE8)
	* WSLとかもこっち
* for Microsoft Windows lovers-->[Node.jsをインストールしよう！ Windows 編 [Beginner's Series to Node.js 3/26] by クラウドデベロッパーちゃんねる](https://youtu.be/06SMdezk8Nc)

あとはこのリポジトリをクローンするなりzipでDLするなりして、
```bash
npm ci #初回のみ
npm run start [<listenPort> <voicevoxの起動してるipアドレス> <voicevoxの待受けポート> <voicevoxの話者>]
```

* 角括弧内は省略可能ですが、後ろのものを指定する場合は手前のものも入力しなければなりません。
*  Web? UIっぽいものができてきたので*nusuttoChan*自体の待受ポート以外は起動してから調整がおすすめです。
* listenPort以外は殊更に暫定的なものなので多分そのうち変わります。初期値は以下です。
	* listenPort: 50080
	* voicevox address: localhost
	* voicevox port: 50021
	* voicevox speaker: 14
		* デフォルトの話者が14になっているのは個人的に冥鳴ひまりさんの声が好きだからです。14番の話者が誰になっているかは各自で確認してください。そのうち１に戻すかもしれない。

## やることリスト
* VOICEVOX以外への対応（できるかどうかはわからない）
*  VOICEVOXのデフォルトの話者を1(or 3)にする
* VOICEVOXのクエリ編集（できれば）
