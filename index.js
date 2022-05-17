//import
//import post from "axios.post";
import axios from "axios";
import express from "express";
import hbs from "hbs";
import childProcess from 'child_process';
import p from 'process';

//express
const listenPort = setListenPort(p.argv[2]);	//なんかまとめれない。　なんでぇ……？？？
function setListenPort(port){					//SyntaxError: Unexpected token '.'
	switch (isNaN(port)) {
		case false:
			if ( port >= 32768|| 
				 port == 8008 || 	//https://ja.wikipedia.org/wiki/TCPやUDPにおけるポート番号の一覧
				 port == 8080 || 	//上記に載っているHTTP Alternateなユーザポートと
				 port == 8000 ||	//私がたまーに見かける8000番、動的・私用ポートを指定している。
				 port == 8081		//3000番とかもあったほうが良いかな？
			) {
				return port;
				break;
			}else{
				console.log("u must set (8000,)8008,8080,8081 or over 32767 as port number.\ndefault port is 50080");
			}
		default:
			if (port == void 0){}else{console.log("Not a Number");}
			return 50080;
	}
}

let app = express();
let server = app.listen(listenPort, function(){
	console.log("Node.js is listening to PORT:" + server.address().port);
	//オープンソースソフトウェアライセンス
	console.log("このアプリケーションにはオープンソースの成果物が含まれています。\nライセンスは同梱のOpenSorceLicenses.txt及びhttp://localhost:"+server.address().port+"/opensorcelicensesより確認可能です。");

});

//VOICEVOX
let voicevox = {
	"settings": {				//voicevoxの設定は全部ここに
		"address": "localhost",
		"port"   : "50021",
		"speaker": "14",
		"lock"   : 1
	},
	"start": function(text){
		axios.post("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/audio_query?text="+encodeURIComponent(text)+"&speaker="+voicevox.settings.speaker)
		.then(res => {
			console.log(res.data);
			voicevox.synthesis.queues.push(res.data);
		})
		.catch(err => {console.log("ERROR_audio_query \n"+err);});
	},
	"synthesis": {
		"queues":[],
		"lock": 0,
		"intervalID": null,
		"process": function() {
			while(voicevox.synthesis.queues.length && voicevox.synthesis.lock < voicevox.settings.lock ){
				voicevox.synthesis.lock++;
				let query = voicevox.synthesis.queues.shift();
				console.log("Synthesis request is being sent!");
				axios.post("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/synthesis?speaker="+voicevox.settings.speaker,
					query,
					{"responseType": "arraybuffer"})
				.then(res => {
					console.log("synthesis:	["+res.request.res.statusCode+"]"+res.request.res.statusMessage);	//res.statusやres.statusTextでもいいっぽい？
					voicevox.synthesis.lock--;
					playing.queues.push(res.data);
				})
				.catch(err => {console.log("ERROR_synthesis \n:"+err);});
			}
		}
	}
}
//テスト用クソコード、考えるのがめんどくさかったからコピペしてる。
//ちゃんと出来たら多分消す
switch (p.argv.length){
	case 6:
		voicevox.settings.speaker = p.argv[5];
		voicevox.settings.port = p.argv[4];
		voicevox.settings.address = p.argv[3];
	case 5:
		voicevox.settings.port = p.argv[4];
		voicevox.settings.address = p.argv[3];
	case 4:
		voicevox.settings.address = p.argv[3];
}

//playing
let playing = {
	"command": "mpv -",
	"queues":[],
	"lock": false,
	"intervalID": null,
	"main": async function(){
		while(playing.queues.length && !playing.lock){
			playing.lock = true;
			let saisei = childProcess.exec(playing.command, function(err, result) {
				if (err) return console.log(err);
				console.log(result);
				playing.lock = false;
			});
			await saisei.stdin.write(playing.queues.shift());
			await saisei.stdin.end();
		}
	}
}

//待ち受けるとこ 
//API的な？
app.get("/talk", function(req) {
	console.log(req.query.text);
	voicevox.start(req.query.text);
});
//ドキュメントとか設定画面を表示
let expressPath = {
	"views"   : "./html/views",
	"patrials": "./html/partials",
	"static"  : "./html/static"
}
app.set('view engine', 'hbs');
app.set('views', expressPath.views);
hbs.registerPartials(expressPath.patrials);
app.use(express.static(expressPath.static));

playing.intervalID = setInterval(playing.main,500);
voicevox.synthesis.intervalID = setInterval(voicevox.synthesis.process,1000);
