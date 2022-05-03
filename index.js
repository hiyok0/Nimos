//variable
const listenPort = 50080; //そのうちここもletに
let playcmd = "mpv -";
let voicevox = {
	"address": "localhost",
	"port"   : "50021",
	"speaker": "14"
};

//require
import fetch from "node-fetch";
import express from "express";
//import fs from 'fs';
import childProcess from 'child_process';


//setup
	var app = express();
	var server = app.listen(listenPort, function(){
		console.log("Node.js is listening to PORT:" + server.address().port);
	});

//query - VOICEVOX		後で下のとfunctionまとめる
async function vvQuery(textEnc){
	console.log(textEnc);
	let queryObj  = await fetch("http://"+voicevox.address+":"+voicevox.port+"/audio_query?text="+textEnc+"&speaker="+voicevox.speaker,{method: 'POST'});
	let queryJson = await queryObj.json();
	console.log(queryJson);
	return queryJson;
}

//synthesis - VOICEVOX
async function vvSynth(query) {
	let onsei = await fetch("http://"+voicevox.address+":"+voicevox.port+"/synthesis?speaker="+voicevox.speaker,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				},
			body: JSON.stringify(query)
			}
	);
	return await onsei.arrayBuffer();
}

//machi-uke 
app.get("/talk", async function(req) {
	console.log(req.query.text);
	let textEnc = encodeURIComponent(req.query.text);
	let queryJson = await vvQuery(textEnc);
	let onseiArrayBuffer = await vvSynth(queryJson);
	
	
	//await fs.writeFileSync( "./audio.wav" , new Uint8Array(onseiArrayBuffer), 'binary');




	let mpv = childProcess.exec(playcmd, function(err, result) {
		if (err) return console.log(err);
		console.log(result);
	});
	await mpv.stdin.write(new Uint8Array(onseiArrayBuffer));
	await mpv.stdin.end();
});
