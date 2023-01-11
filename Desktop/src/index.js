if(require('electron-squirrel-startup')) return;
const DiscordRPC = require('discord-rpc');
const clientId = '995095535709081670';

DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const express = require("express")
const http = require("http")
const path = require('path');
const nconf = require('nconf')
nconf.use('file', { file: path.join(__dirname,"config.json") });
//RESTAPI imports
const wabserver = express();
const server = http.Server(wabserver);
const bodyParser = require("body-parser");
const utils = require('./utils')
const positron = require('./positron')
const { app, BrowserWindow, ipcMain  } = require('electron');
let config = nconf.get()
let Mainwindow
let Settingswindow
let tray = null
let info = [
	{
		"creater": "No Video",
        "title": "Waiting For REST API",
        "thumbnail": "ytlogo4",
        "extra":{
            "url": "https://google.com",
			"views": "0",
            "likes": "0"
        },
		"hasData": false
	},
	{
        "curruntTime": 0,
        "totalTime": 0,
        "timePercent": 0,
		"formatedTime": ["0:00","0:00"]
	},
]


wabserver.use(bodyParser.json());
console.clear = () =>{console.log("\033[2J \033[H \033c ")} //since console.clear() stil doesn't work on windows :face_palm:

function createWindow(){
	Mainwindow = new BrowserWindow({
        width: 425,
        height: 260,
        resizable: false,		
        webPreferences: {
            contextIsolation: true,
			preload: path.join(__dirname, 'app','preload.js')
        },
        frame: false,
    });
    Mainwindow.loadFile(path.join(__dirname, '/app/index.html'));
	if (!tray) { positron.createBasicTray(tray,Mainwindow) }
	Mainwindow.on('closed',() => { Mainwindow = null })
}

function createWindow2(){
	Settingswindow = new BrowserWindow({
        width: 600,
        height: 600,
        resizable: false,		
        webPreferences: {
            contextIsolation: true,
			preload: path.join(__dirname, 'app','preload.js')
        },
        frame: false,
    });
    Settingswindow.loadFile(path.join(__dirname, '/app/settings.html'));
	// Settingswindow.webContents.send('getstatus',nconf.get())
}


ipcMain.handle('winControls',(event,arg) => {
	positron.handleWinControls(arg)
}) 


ipcMain.handle('settings',(event,arg) => {
	console.log(`[ipcMain] [settings] > settings`)
	createWindow2();
})





ipcMain.handle('status',(event,args) => {
	console.log(args)
	if (nconf.get('mode') !== args.Service){
		info[1].curruntTime = 0
		info[1].totalTime = 0
		info[1].timePercent= 0
		info[1].formatedTime = ["0:00","0:00"]
		sendUpdate()
	}
	nconf.set('mode',args.Service)
	nconf.set('showTTY',args.showTTy)
	nconf.set('useVideoThumbnails',args.useVideo)
	nconf.save()
})
ipcMain.handle('getStatus',() => nconf.get())


wabserver.post("/YTmusic", (req, res) => {
	const {
		title,
		creater,
		views,
		likes,
		url,
		time,
		thumbnail
	} = req.body;
	console.log(JSON.stringify(req.body))
	if (nconf.get('mode') == "ytmusic"){
		info[0].creater = creater
		info[0].title = title
		info[0].thumbnail = thumbnail
		info[0].extra = {
			url: url,
			views: views,
			likes: likes
		}
		info[0].hasData = true
		sendUpdate()
		res.send(utils.formattedErrorBuilder("YTmusic"));
	}else{
		res.send(utils.formattedErrorBuilder("YTmusic",3));
	}
	
});




wabserver.post("/Time", (req, res) => {
	var {
		curruntTime,
		totalTime,
		timeP,
		formatedTime,
		service
	} = req.body;
	if (!info[0].hasData){
		res.send(utils.formattedErrorBuilder("/Time",1))
	}else{
		res.send(utils.formattedErrorBuilder("/Time"));
	}
	info[1] = {
		curruntTime: curruntTime,
		totalTime: totalTime,
		timePercent: timeP,
		formatedTime: utils.formattedTimeBuilder(curruntTime,totalTime)
	}
		if (nconf.get('showTTY')){utils.printTTY(info,nconf.get('useVideoThumbnails'))}
		nconf.get('useVideoThumbnails') ? image = info[0].thumbnail : image = "ytlogo4"       //config toggle for thumbnail  | if (config.useVideoThumbnails) {image = info[0].thumbnail}else{image = "ytlogo4"}
		if (service == nconf.get('mode')){ // check to see if the services is selected
			sendUpdate()
		}
		return
});


app.whenReady().then(() => {createWindow();})






//DISCORD RPC
rpc.on('ready', () => {
	console.log("Ready");
	setActivity();
});

async function setActivity() {
    rpc.setActivity({
      details: "Waiting For REST API",
      largeImageKey: "ytlogo4",
      large_text: "Large Text Here!",
      buttons: [{"label": "Watch Video", "url": "https://google.com"}],
      instance: false,
    });
  }


function sendUpdate(){
	// code to refresh RPC and send update to gui
	rpc.setActivity({
		details: `${info[0].title} ${info[1].formatedTime[0]} / ${info[1].formatedTime[1]}`,
		state: `By ${info[0].creater}`,
		largeImageKey: `${info[0].thumbnail}`,
		smallImageKey: `ytlogo4`,
		smallImageText: "WatchRPC v2",
		largeImageText: `${info[1].formatedTime[0]} / ${info[1].formatedTime[1]} | ${Math.round(info[1].timePercent)}%`,
		buttons: [{"label": "Watch Video", "url":`${info[0].extra.url}`}],
		instance: false,
	})
	.catch((err) => {
		console.error(err)
	})
	Mainwindow.webContents.send('infoUpdate',info)
}



//DISCORD RPC
server.listen(9494, () => {
    console.log(`Server listening on port 9494`);
    rpc.login({ clientId }).catch(console.error);
})