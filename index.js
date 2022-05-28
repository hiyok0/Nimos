//require
const axios = require("axios");
const express = require("express");
const hbs = require("hbs");
const { app, BrowserWindow } = require("electron");
const childProcess = require("child_process");
const p = require("process");
const path = require("path")

//import post from "axios.post";
/*
import axios from "axios";
import express from "express";
import hbs from "hbs";
import app from "electron";
import BrowserWindow from "electron";
import childProcess from 'child_process';
import p from 'process';
*/

let ready = {
	"status": false,
	"port": null,
	"go"	: function(){
		if (ready.status){
			clearInterval(ready.IntervalID);
			//splashWindow.destroy();
			generateMainWindow();
		}
	},
	"IntervalID": null
}

//electron（splash＋最初のelectron）
/*
const createSplash = () => {
	const splashWindow = new BrowserWindow({
		frame: false,	// フレームレスにする
		width: 400,
		height: 300,
	})
	splashWindow.loadURL('https://images-fe.ssl-images-amazon.com/images/I/91VGBiIS6hL.jpg')
}
app.whenReady().then(() => {
	createSplash()
})*/
app.on('window-all-closed', () => {}) //こうするとなんかうまくいく

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

//electron（メイン？）
function generateMainWindow() {
	const createWindow = () => {
	  // ブラウザウインドウを作成します。
	  const mainWindow = new BrowserWindow({
		width: 475,
		height: 800,
	  })

	  // そしてアプリの index.html を読み込みます。
	  mainWindow.loadURL("http://localhost:"+ready.port)

	  // デベロッパー ツールを開きます。
	  // mainWindow.webContents.openDevTools()
	}
	app.whenReady().then(() => {
		createWindow()

		app.on('activate', () => {
			// macOS では、Dock アイコンのクリック時に他に開いているウインドウがない
			// 場合、アプリのウインドウを再作成するのが一般的です。
			if (BrowserWindow.getAllWindows().length === 0) createWindow()
		})
	})
}

let expressApp = express();
let server = expressApp.listen(listenPort, function(){
	console.log("nusuttoChan is listening to PORT:" + server.address().port);
	//オープンソースソフトウェアライセンス
	console.log("このアプリケーションにはオープンソースの成果物が含まれています。\nライセンスは同梱のOpenSorceLicenses.txt及びhttp://localhost:"+server.address().port+"/opensorcelicensesより確認可能です。");
	//splashからメイン画面に
	Object.assign(ready, {
		"status": true,
		"port": server.address().port
	});
});

//VOICEVOX
let voicevox = {
	"settings": {				//voicevoxの設定は全部ここに
		//全体
		"address": "localhost",
		"port"   : "50021",
		"speaker": "14",
		//クエリの編集
		//speed,pitch,抑揚
		//合成プロセスに関する部分
		"lock"   : 1,
		"intervalTime": 1000,
		"option":{
			"speedScale": "1",
			"pitchScale": "0",
			"intonationScale": "1",
			"volumeScale": "1",
			"prePhonemeLength": "0.1",
			"postPhonemeLength": "0.1",
			"outputSamplingRate": "24000",
			"outputStereo": false,
		}
	},
	"start": function(text){
		axios.post("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/audio_query?text="+encodeURIComponent(text)+"&speaker="+voicevox.settings.speaker)
		.then(res => {
			console.log(res.data);
			voicevox.synthesis.queues.push({
				"speaker": voicevox.settings.speaker,
				"query"  : res.data
			});
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
				let queryObj = voicevox.synthesis.queues.shift();
				console.log("Synthesis request is being sent!");
				axios.post("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/synthesis?speaker="+queryObj.speaker,
					queryObj.query,
					{"responseType": "arraybuffer"})
				.then(res => {
					console.log("synthesis:	["+res.request.res.statusCode+"]"+res.request.res.statusMessage);	//res.statusやres.statusTextでもいいっぽい？
					voicevox.synthesis.lock--;
					playing.queues.push(res.data);
				})
				.catch(err => {console.log("ERROR_synthesis \n:"+err);});
			}
		}
	},
	"getSpeakers": async function() { // NOT USED!!!!
		console.log("request speaker list of voicevox……");
		axios.get("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/speakers")
		.then(res => {
			//console.log(res.data)
			return res.data;
			
		})
		.catch(() => {
			console.log("requesting speaker list of voicevox is failed.");
			return [{
					"name"  : "ERROR",
					"styles": [{"id": 1,"name":"話者リストを取得できませんでした。"}]
				}];
		});
	},
	"speakers":[]
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
	"settings" : {
		"command": "mpv -",
		"intervalTime": 500
	},
	"queues":[],
	"lock": false,
	"intervalID": null,
	"main": async function(){
		while(playing.queues.length && !playing.lock){
			playing.lock = true;
			let saisei = childProcess.exec(playing.settings.command, function(err, result) {
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
//音声リクエスト受付 **最重要**
expressApp.get("/talk", function(req) {
	console.log(req.query.text);
	voicevox.start(req.query.text);
});
//webUI
let expressPath = {
	"views"   : path.join(__dirname, "./html/views"),
	"patrials": path.join(__dirname, "./html/partials"),
	"static"  : path.join(__dirname, "./html/static")
}
expressApp.set('view engine', 'hbs');
expressApp.set('views', expressPath.views);
hbs.registerPartials(expressPath.patrials);
expressApp.get('/settings', (req, res) => {
	axios.get("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/speakers")
	.then(res => {
		console.log(res.data)
		voicevox.speakers = res.data;
	})
	.catch(() => {
		console.log("requesting speaker list of voicevox is failed.");
		voicevox.speakers = [{
				"name"  : "ERROR",
				"styles": [{"id": 1,"name":"話者リストを取得できませんでした。"}]
			}];
	})
	.finally(() => {
			res.render('settings', {
				playing : playing.settings,
				voicevox: {
					settings: voicevox.settings,
					speakers: voicevox.speakers
				}
			});
	});
});
expressApp.get("/pages",(req, res) => {
	console.log("pages?page="+req.query.page+" is called!");
	res.render("pages/"+req.query.page);
});
expressApp.get("/", (req, res) => {
	console.log("/ is called");
	let resObj = {
		"processVersions": process.versions,
		"nusuttoChanVersion": process.env.npm_package_version,
		"menu": [
			{
				"name": "About",
				"link": "/pages?page=about",
				"icon": "passport-line",
				"color": "lightyellow"
			},
			{
				"name": "Settings",
				"link": "/settings",
				"icon": "settings-5-line",
				"color": "gainsboro"
			},
			{
				"name": "GitHub",
				"link": "https://github.com/hiyok0/nusuttoChan/",
				"icon": "github-fill",
				"color": "white"
			},
			{
				"name": "Twitter",
				"link": "https://twitter.com/Jewel_Flash",
				"icon": "twitter-fill",
				"color": "rgb(91,154,236)"
			},
			{
				"name": "License表示",
				"link": "/pages?page=opensorcelicenses",
				"icon": "file-paper-2-line",
				"color": "aliceblue"
			},
			{
				"name": "Icon License",
				"link": "/pages?page=remixiconlisence",
				"icon": "remixicon-line",
				"color": "dodgerblue"
			}]
	};
	if(req.query.finished == true || req.query.finished == "true"){
		resObj.finished = true
	}else{ resObj.finished = false};
	res.render("top", resObj);
});
expressApp.use(express.static(expressPath.static));
//設定とかのあれ
expressApp.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded　ニセトランスルー機能つけようと思ったときにぶつからないかな……？
expressApp.post('/set', (req, res) => {
  console.log('--- post() /set called ---')
  console.log(req.body)
  Object.assign(playing.settings,req.body.playing);//playing
  Object.assign(voicevox.settings,req.body.voicevox);//VOICEVOX
  res.redirect('/?finished=true')
})

ready.IntervalID = setInterval(ready.go,100);
playing.intervalID = setInterval(playing.main,playing.settings.intervalTime);
voicevox.synthesis.intervalID = setInterval(voicevox.synthesis.process,voicevox.settings.intervalTime);
