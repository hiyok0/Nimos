//variable
let playcmd = "mpv -";
let voicevoxSettings = {	//ほかも追加したらsettings.voicevoxにするかも
	"address": "localhost",
	"port"   : "50021",
	"speaker": "14"		//配列にして複数指定できても面白いかもしれない
};
let playQueue = [];
let playLock = false;

//require
import fetch from "node-fetch";
import express from "express";
import childProcess from 'child_process';
import p from 'process';
import {add,synthesis} from './voicevoxEngine.js';

//テスト用クソコード、考えるのがめんどくさかったからコピペしてる。
//ちゃんと出来たら多分消す
switch (p.argv.length){
	case 6:
		voicevoxSettings.speaker = p.argv[5];
		voicevoxSettings.port = p.argv[4];
		voicevoxSettings.address = p.argv[3];
	case 5:
		voicevoxSettings.port = p.argv[4];
		voicevoxSettings.address = p.argv[3];
	case 4:
		voicevoxSettings.address = p.argv[3];
}

//setup
	//port設定
	const listenPort = setListenPort(p.argv[2]);	//まとめる書き方ありそう
	function setListenPort(port){
		switch (isNaN(port)) {
			case false:
				if ( port >= 32768|| 
					 port == 8008 || 	//https://ja.wikipedia.org/wiki/TCPやUDPにおけるポート番号の一覧
					 port == 8080 || 	//上記に載っているHTTP Alternateなユーザポートと
					 port == 8000 ||	//私がたまーに見かける8000番、
					 port == 8081		//動的・私用ポートを指定している。3000も要るかな？
				) {
					return port;
					break;
				}else{
					console.log("u must set 8000,8008,8080,8081 or over 32767 as port number.\ndefault port is 50080");
				}
			default:
				if (isNaN(port)){console.log("Not a Number");}
				return 50080;
		}
	}
	//express待受開始
	var app = express();		//コピペでappのままなのどうにかする。というか本当にvarじゃなきゃだめ？
	var server = app.listen(listenPort, function(){
		console.log("nusuttoChan is listening to PORT:" + server.address().port);
	});
	//VOICEVOXの最初用
	//setup();
	setInterval(synthesis,1000);

/*
//VOICEVOX
async function voicevoxProcess(textEnc){
	//query
	console.log(textEnc);
	let queryObj  = await fetch("http://"+voicevoxSettings.address+":"+voicevoxSettings.port+"/audio_query?text="+textEnc+"&speaker="+voicevoxSettings.speaker,{method: 'POST'});
	let queryJson = await queryObj.json();
	console.log(queryJson);
	//synthesis
	let onsei = await fetch("http://"+voicevoxSettings.address+":"+voicevoxSettings.port+"/synthesis?speaker="+voicevoxSettings.speaker,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				},
			body: JSON.stringify(queryJson)
			}
	);
	return await onsei.arrayBuffer();
} 
*/

//machi-uke 
app.get("/talk", async function(req) {
	console.log(req.query.text);
	add(req.query.text);
});

//実際に鳴らす
function playSound () {
	while (playQueue.length && !playLock){		//聖徳太子モード考えるとswitchのほうが良かったかも
		playLock = true;
		console.log("playQueue.length: "+playQueue.length);
		let mpv = childProcess.exec(playcmd, function(err, result) {	//本当はspawnのほうが良いのかな？
			if (err) return console.log(err);
			console.log(result);
			playLock = false;
		});
		mpv.stdin.write(playQueue.shift());
		mpv.stdin.end();
	}
}

setInterval(playSound,500);

