//variable
let playcmd = "mpv -";
let voicevoxSettings = {	//ほかも追加したらsettings.voicevoxにするかも
	"address": "localhost",
	"port"   : "50021",
	"speaker": "14"		//配列にして複数指定できても面白いかもしれない
};
let synthesisQueue = [];
//let playQueue = [];
let synthesisLock = false;

//require
import fetch from "node-fetch";

//setup
export async function add(text){
	/*デフォルト設定とかを入れる　　　　　↓*/
	await synthesisQueue.push(await query(text));
}
/*export function setup(delay){
	setInterval(synthesis,delay);
}*/

//query
async function query(text){ //あとでやる
	let queryObj  = await fetch("http://10.0.1.4:50021/audio_query?text="+encodeURIComponent(text)+"&speaker="+voicevoxSettings.speaker,{method: 'POST'});
	/*
	 * 誰の声でクエリを作ったかの情報とかも入れる（無駄だから後で）
	 */
	return await queryObj.json();
}
//synthesis
export async function synthesis(){
	while(synthesisQueue.length & !synthesisLock){
		let onsei = await fetch("http://10.0.1.4:50021/synthesis?speaker="+voicevoxSettings.speaker,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					},
				body: JSON.stringify(synthesisQueue.shift())
				}
		);
		await playQueue.push(onsei.arrayBuffer());
	}
}
