//variable
const listenPort = 50080; //やっぱりここはletにしない。
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


//setup
	var app = express();
	var server = app.listen(listenPort, function(){
		console.log("Node.js is listening to PORT:" + server.address().port);
	});

//VOICEVOX		まとめた
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
