//variable
let playcmd = "mpv -";
let voicevoxSettings = {
	"address": "localhost",
	"port"   : "50021",
	"speaker": "14"
};

//require
import fetch from "node-fetch";
import express from "express";
//import fs from 'fs';
import childProcess from 'child_process';
import p from 'process';

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
//port
const listenPort = setListenPort(p.argv[2]);	//まとめる書き方ありそう
function setListenPort(port){
	switch (isNaN(port)) {
		case false:
			if ( port >= 32768|| 
				 port == 8008 || 	//https://ja.wikipedia.org/wiki/TCPやUDPにおけるポート番号の一覧
				 port == 8080 || 	//上記に載っているHTTP Alternateなユーザポートと
				 port == 8000 ||	//私がたまーに見かける8000番、
				 port == 8081		//動的・私用ポートを指定している。
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
//express
var app = express();
var server = app.listen(listenPort, function(){
	console.log("nusuttoChan is listening to PORT:" + server.address().port);
});

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

//machi-uke 
app.get("/talk", async function(req) {
	console.log(req.query.text);
	let onseiArrayBuffer = await voicevoxProcess(encodeURIComponent(req.query.text));
	
	
	//await fs.writeFileSync( "./audio.wav" , new Uint8Array(onseiArrayBuffer), 'binary');


	let mpv = childProcess.exec(playcmd, function(err, result) {
		if (err) return console.log(err);
		console.log(result);
	});
	await mpv.stdin.write(new Uint8Array(onseiArrayBuffer));
	await mpv.stdin.end();
});
