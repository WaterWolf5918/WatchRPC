// if(require('electron-squirrel-startup')) return;
import DiscordRPC = require('discord-rpc');
import express from 'express';
import http from 'http';
import path from 'path'
import bodyParser = require('body-parser');
import positron = require('./positron');
import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import { VideoMetadata,ConfigHelper, formattedErrorBuilder, formattedTimeBuilder } from './utils';
const configHelper = new ConfigHelper(path.join(__dirname,'../config.json'))
const webServer    = express();
const server       = new http.Server(webServer);
const clientId     = "995095535709081670"
const rpc          = new DiscordRPC.Client({ transport: 'ipc' });
let Mainwindow: BrowserWindow
let Settingswindow
const tray: Tray = null
const info: VideoMetadata = {
    video: {
        creator: '',
        title: '',
        views: '',
        likes: '',
        thumbnail: '',
        url: ''
    },
    time: {
        curruntTime: 0,
        totalTime: 0,
        timePercent: 0,
        formattedTime: ''
    },
    extra: {
        platform: '',
        uuid: '',
        browser: ''
    }
}







webServer.use(bodyParser.json());
console.clear = () => { console.log('\x033[2J \x033[H \x033c ') } //since console.clear() stil doesn't work on windows :face_palm:

function createWindow() {
    Mainwindow = new BrowserWindow({
        width: 425,
        height: 260,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: false,
    });
    Mainwindow.loadFile(path.join(__dirname, '../app/index.html'));
    if (!tray) { positron.createBasicTray(tray, Mainwindow) }
    Mainwindow.on('closed', () => { Mainwindow = null })
}

function createWindow2() {
    Settingswindow = new BrowserWindow({
        width: 600,
        height: 600,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: false,
    });
    Settingswindow.loadFile(path.join(__dirname, '../app/settings.html'));
    // Settingswindow.webContents.send('getstatus',nconf.get())
}


ipcMain.handle('winControls', (_event, arg) => {
    positron.handleWinControls(arg)
})


ipcMain.handle('settings', (_event, _arg) => {
    console.log(configHelper.getFull())
    console.log(`[ipcMain] [settings] > settings`)
    createWindow2();
})





ipcMain.handle('setOptions',(event,args) => {
	if (configHelper.get('mode') !== args.Service){
		info.time.curruntTime = 0
		info.time.totalTime = 0
		info.time.timePercent= 0
		info.time.formattedTime = formattedTimeBuilder(0,0)
		// sendUpdate()
	}
    configHelper.set('mode',args.Service)
    configHelper.set('showTTY',args.showTTy)
    configHelper.set('useVideoThumbnails',args.useVideoThumbnails)
})

// webserver.post('/YTmusic', (req, res) => {
// 	const {
// 		title,
// 		creater,
// 		views,
// 		likes,
// 		url,
// 		time,
// 		thumbnail
// 	} = req.body;
// 	console.log(JSON.stringify(req.body))
// 	// if (nconf.get('mode') == 'ytmusic'){
// 		info[0].creater = creater
// 		info[0].title = title
// 		info[0].thumbnail = thumbnail
// 		info[0].extra = {
// 			url: url,
// 			views: views,
// 			likes: likes
// 		}
// 		info[0].hasData = true
// 		sendUpdate()
// 		res.send(utils.formattedErrorBuilder('YTmusic'));
// 	// }else{
// 	// 	res.send(utils.formattedErrorBuilder('YTmusic',3));
// 	// }
// });

webServer.post('/data')


webServer.post("/open/:uuid/:service", (req,res) => {
    if(info.extra.uuid == ""){
        info.extra.uuid = req.params.uuid
        console.log("waiting for close request")
    }else{
        console.log("can't change source")
    }
    console.log(`UUID: ${req.params.uuid}`)
    res.send(formattedErrorBuilder("/Time",0))
})


webServer.post("/close/:uuid/:service", (req,res ) => {
    if (info.extra.uuid !== req.params.uuid){return}
    if(info.extra.uuid == ""){
        console.log("no source to quic")
    }else{
        console.log("got close request")
        info.extra.uuid = ""
        info.extra.platform = ""
    }

    console.log(req.params.uuid)
    res.send(formattedErrorBuilder("/Time",0))
})

webServer.post('/time/:service/:uuid', (req, res) => {
	const {
		curruntTime,
		totalTime,
		timeP,
		formatedTime,
	} = req.body;
    res.send("OK")
    // console.log(`${JSON.stringify(req.params)}\n${info.extra.uuid} | ${configHelper.get("mode")}`)
    console.log(`${info.extra.uuid}  |  ${req.params.uuid}`)
    // console.log(req.body)
    if(info.extra.uuid == ""){info.extra.uuid = req.params.uuid}
    if (info.extra.uuid !== req.params.uuid){ return }
    if (configHelper.get("mode") !== req.params.service){ return }
    console.log(req.body)
    
});


app.whenReady().then(() => { createWindow(); })

ipcMain.handle('getOptions', () => {return configHelper.getFull()}) //nconf.get()
ipcMain.handle('forceRefresh', () => { Mainwindow.reload() })

//DISCORD RPC
DiscordRPC.register(clientId);
rpc.on('ready', () => {
    console.log('Logged in as', rpc.user.username);
    setActivity();
});





async function setActivity() {
    rpc.setActivity({
        details: 'Waiting For REST API',
        largeImageKey: 'ytlogo4',
        instance: false,
    });
}


function sendUpdate() {
    // code to refresh RPC and send update to gui
    rpc.setActivity({
        details: `${info.video.title} ${info.time.formattedTime} / ${info.time.formattedTime}`,
        state: `By ${info.video.creator}`,
        largeImageKey: `${info.video.thumbnail}`,
        smallImageKey: `ytlogo4`,
        smallImageText: 'WatchRPC v2',
        largeImageText: `${info.time.formattedTime} / ${info.time.formattedTime} | ${Math.round(info.time.timePercent)}%`,
        buttons: [{ 'label': 'Watch Video', 'url': `${info.video.url}` }],
        instance: false,
    })
        .catch((err) => {
            console.error(err)
        })
    Mainwindow.webContents.send('infoUpdate', info)
}



//DISCORD RPC
server.listen(9494, () => {
    console.log(`Server listening on port 9494`);
    rpc.login({ clientId }).catch(err => { console.error(err) })
})