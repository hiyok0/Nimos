//require
const axios = require("axios");
const express = require("express");
const portfinder = require("portfinder");
const hbs = require("hbs");
const { app, Menu, BrowserWindow, dialog } = require("electron");
const childProcess = require("child_process");
const path = require("path")
const fs = require("fs");

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

//準備用
const ready = {
	"settings": false,
	"server": false,
	"port": 50080, //デフォルトポート
	"listen":function (startPort){
		portfinder.getPortPromise({
			port: startPort
		})
		.then((availablePort) => {
			server = expressApp.listen(availablePort, function(){
				console.log("nusuttoChan is listening to PORT:" + server.address().port);
				//オープンソースソフトウェアライセンス
				console.log("このアプリケーションにはオープンソースの成果物が含まれています。\nライセンスは同梱のOpenSorceLicenses.txt及びhttp://localhost:"+server.address().port+"/opensorcelicensesより確認可能です。");
				//splashからメイン画面に
				Object.assign(ready, {
					"server": true,
					"port": server.address().port
				});
			});
		})
		.catch((err) => {
			dialog.showErrorBox("Failed to find available port.",`${err}`);
			//app.quit();
		});
	},
	"go"	: function(){
		if (ready.server){
			clearInterval(ready.IntervalID);
			//splashWindow.destroy();
			generateMainWindow();
		}
	},
	"IntervalID":  null
}

//設定ファイル関連
const setting = {
	"load": new Promise((resolve, reject) => {
		fs.readFile(app.getPath("userData")+"/settei.json",{encoding: "utf8", flag: "r" },(err, fd) => {
			if(err){
				console.log("cannnot read setting file");
				resolve();
			}
			if(fd){
				/* 0.xのコードネーム、juncat
				 * その構造が最初に採用されたバージョンのコードネーム.プロファイル名
				 * プロファイル切り替えは未実装
				 */
				const settingsObj = JSON.parse(fd).juncat.default;
				console.log(settingsObj);
				//for(e of ["playing","voicevox"]){Object.assign([e].settings,settingsObj[e]);}
				playing.settings  = settingsObj.playing;
				voicevox.settings = settingsObj.voicevox;
				if(settingsObj.port && !isNaN(settingsObj.port)){ready.port = settingsObj;}
				ready.settings = true;
				resolve();
			}
		});
	}),
	"save": function(isInApp){
		fs.writeFile(app.getPath("userData")+"/settei.json", JSON.stringify({
			"juncat": { "default": {
			"playing" : playing.settings,
			"voicevox": voicevox.settings,
			"port"	  : ready.port
			}}
		}),
		{
			encoding: "utf8",
			flag:     "w"
		},
		err => {
			if(err && isInApp){dialog.showErrorBox("Failed to write settei.json",`${err}`);}
			//アプリ外から実行したときにどうにかならんか……
		})
	}
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
const expressApp = express();
let server ;	//設定ファイルを作った時は項目の有無とか考えてもいいかもしれない
//ready.listen(ready.port);

/*
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
}*/

//electron（メイン？）
function generateMainWindow() {
	const createWindow = () => {
	  // ブラウザウインドウを作成します。
		const mainWindow = new BrowserWindow({
			width: 480,
			height: 800,
		})
	
	// メニューを適用する
	app.setAboutPanelOptions({
		applicationName: app.name,
		applicationVersion: app.getVersion(),
		copyright: "(c) hiyoko Project",
		version: app.getVersion()+" on "+process.platform.replace("darwin", "macOS"),
		credits: "hiyoko Project",
		authors: ["hiyoko","sekaii"],
		website: "https://github.com/hiyok0/nusuttoChan",
		iconPath: path.join(__dirname, "./html/static/assets/icon.png")
	})
	Menu.setApplicationMenu(Menu.buildFromTemplate([
		{
			label: app.name,
			submenu:[
				{role: "about", label: app.name+"について" },
				{type:'separator'},
				{role:'hide',       label:`${app.name}を隠す`},
				{role:'hideothers', label:'ほかを隠す'},
				{role:'unhide',     label:'すべて表示'},
				{type:'separator'},
				{role:'quit',       label:`${app.name}を終了`}
			]
		},
		{
			label: "編集",
			submenu: [
				{ role:'undo',  label:'元に戻す' },
				{ role:'redo',  label:'やり直す' },
				{ type:'separator' },
				{ role:'cut',   label:'切り取り' },
				{ role:'copy',  label:'コピー' },
				{ role:'paste', label:'貼り付け' },
			]
		},
		{
			label: "表示",
			submenu: [
				{ role: "reload", label: "ページを再読み込み"}
			]
		}
	]));
	
	mainWindow.loadURL("http://localhost:"+ready.port)
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

//VOICEVOX
const voicevox = {
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
		"options":{
			"outputStereo": "false"
		}
	},
	"start": function(text,options){
		const queryQueue = {
			"speaker": voicevox.settings.speaker,
			"queue"  : null
		};
		if(options.speaker){
			console.log("speaker: "+options.speaker);
			queryQueue.speaker = options.speaker;
		}
		for(effect in options.effects){
			if(options.effects[effect] == void 0){delete options.effects[effect]}
		}
		axios.post("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/audio_query?text="+encodeURIComponent(text)+"&speaker="+queryQueue.speaker)
		.then(res => {
			console.log(res.data);
			queryQueue.query = Object.assign(res.data,options.effects);
			voicevox.synthesis.queues.push(queryQueue);
			console.log(queryQueue.query);
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
				const queryObj = voicevox.synthesis.queues.shift();
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
	"clearQueues": function() {
		voicevox.synthesis.queues.length = 0;
		console.log("voicevox.synthesis.queues is cleared.");
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

//playing
const playing = {
	"settings" : {
		"command": "/usr/local/bin/mpv -",
		"intervalTime": 500
	},
	"queues":[],
	"lock": false,
	"intervalID": null,
	"main": async function(){
		while(playing.queues.length && !playing.lock){
			playing.lock = true;
			const saisei = childProcess.exec(playing.settings.command, function(err, result) {
				if (err) return console.log(err);
				console.log(result);
				playing.lock = false;
			});
			await saisei.stdin.write(playing.queues.shift());
			await saisei.stdin.end();
		}
	},
	"clearQueues": function() {
		playing.queues.length = 0;
		console.log("playing.queues is cleared.");
	}
}

//待ち受けるとこ
//連携用or連携を機に実装
	//音声リクエスト受付 **最重要**
	expressApp.get("/talk", function(req, res) {
		console.log(req.query.text);
		voicevox.start(req.query.text, {
			"speaker": req.query.voice,
			"effects": {
				"speedScale": req.query.speed,
				"pitchScale": req.query.tone,
				"volumeScale": req.query.volume
			}
		});
		res.send("nusuttoChan");//一応設定可能にしてもいいかもしれない
	});
	//キューのクリア **重要**
	expressApp.get("/clear", function(req, res) {
		console.log("--- get() /clear called ---");
		if(req.header('User-Agent').indexOf("live-comment-viewer") + 1){
			res.send("nusuttoChan");//一応設定可能にしてもいいかもしれない
		}else{
			res.redirect('/?finished=true');
		}
		voicevox.clearQueues();
		playing.clearQueues();
	});
	//話者リストを返す（仮）こういうのじゃなくて対応表はユーザに作らせてもいいかもしれない。
	expressApp.get("/GetVoiceList", function(req, res) {
		console.log("/GetVoiceList called. Return speakers list.");
		axios.get("http://"+voicevox.settings.address+":"+voicevox.settings.port+"/speakers")
		.then( speakersList => {
			console.log(speakersList.data);
			const resData = [];
			while(speakersList.data.length){
				const washa = speakersList.data.shift();
				while(washa.styles.length){
					let style = washa.styles.shift();
					resData.push({
						"id": parseFloat(style.id) + 0,		//帰ってきたときにこっちがもっと処理しやすい形はなんだろう。
						"kind": "VOICEVOX",
						"name": "VOICEVOX："+washa.name+"（"+style.name+"）",
						"alias": ""
					});
				}
			}
			res.type("json");
			res.send(JSON.stringify(resData));
		})
		.catch(speakersList => {
			res.type("json");
			res.send(JSON.stringify({
				"id": parseFloat(voicevox.settings.speaker) + 0,
				"name": "話者リストの取得に失敗しました。（［"+speakersList.status+"］"+speakersList.statusText+"）"
			}));
		});
	});
//webUI
const expressPath = {
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
				"styles": [{"id": voicevox.settings.speaker,"name":"取得できませんでした。"}]
			}];
	})
	.finally(() => {
			res.render('settings', {
				playing : playing.settings,
				voicevox: {
					settings: voicevox.settings,
					speakers: voicevox.speakers,
					outputStereo: JSON.parse(voicevox.settings.options.outputStereo) //文字列のfalseではhandlebarsでtrue扱いになってしまうため
				}		//複数出てきたらtoBooleanとかで固めるかもしれない
			});
	});
});
expressApp.get("/pages",(req, res) => {
	console.log("pages?page="+req.query.page+" is called!");
	res.render("pages/"+req.query.page);
});
expressApp.get("/", (req, res) => {
	console.log("/ is called");
	const resObj = {
		"appName": app.name,
		"port": server.address().port,
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
				"name": "Clear",
				"link": "/clear",
				"icon": "delete-bin-2-line",
				"color": "#cc526a"
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
	if( server.address().port !== ready.port ){
		resObj.port = resObj.port + "(--> "+ready.port+")"
	}
	if(req.query.finished == true || req.query.finished == "true"){
		resObj.finished = true
	}else{ resObj.finished = false};
	res.render("top", resObj);
});
expressApp.use(express.static(expressPath.static));
//設定とかのあれ
expressApp.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded　ニセトランスルー機能つけようと思ったときにぶつからないかな……？
expressApp.post('/set', (req, res) => {
	console.log('--- post() /set called ---');
	for(entry in req.body){for(key in req.body[entry]){		//２階層目でのみ
		if(req.body[entry][key] === ""){delete req.body[entry][key];}
	}}
	for(property in req.body.voicevox.options){				//assignする前に無いものを消しておく
		if(req.body.voicevox.options[property] === ""){
			delete voicevox.settings.options[property];
			delete req.body.voicevox.options[property];
		}
	}
	console.log(req.body);
	Object.assign(playing.settings,req.body.playing);//playing
	Object.assign(voicevox.settings,req.body.voicevox);//VOICEVOX
	if(Number(req.body.port) > 1023){ready.port = req.body.port};//Number("") == 0 らしいので
	res.redirect('/?finished=true')
	console.log(voicevox.settings.options.outputStereo);
	setting.save(req.header('User-Agent').indexOf(app.name) + 1);
})

setting.load.then(() => {ready.listen(ready.port);});
ready.IntervalID = setInterval(ready.go,100);
playing.intervalID = setInterval(playing.main,playing.settings.intervalTime);
voicevox.synthesis.intervalID = setInterval(voicevox.synthesis.process,voicevox.settings.intervalTime);
