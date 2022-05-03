//variable
const listenPort = 50080
const audioDevice = "BlackHole 2"
const vvAddr = "localhost:50021"
const vvVoice = "14"

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
	let queryObj  = await fetch("http://"+vvAddr+"/audio_query?text="+textEnc+"&speaker="+vvVoice,{method: 'POST'});
	let queryJson = await queryObj.json();
	console.log(queryJson);
	return queryJson;
}

//synthesis - VOICEVOX
async function vvSynth(query) {
	let onsei = await fetch("http://"+vvAddr+"/synthesis?speaker="+vvVoice,
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




	let mpv = childProcess.exec("ffplay -autoexit -nodisp -", function(err, result) {
		if (err) return console.log(err);
		console.log(result);
	});
	await mpv.stdin.write(new Uint8Array(onseiArrayBuffer));
	await mpv.stdin.end();
});
