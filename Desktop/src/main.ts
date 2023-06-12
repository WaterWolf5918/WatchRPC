/* eslint-disable @typescript-eslint/ban-ts-comment */
// if(require('electron-squirrel-startup')) return;
if (require("electron-squirrel-startup")) process.exit();
import DiscordRPC = require("discord-rpc");
import express from "express";
import http from "http";
import path from "path";
import bodyParser = require("body-parser");
import positron = require("./positron");
import { app, BrowserWindow, dialog, ipcMain, nativeImage, Tray } from "electron";
import {
    VideoMetadata,
    ConfigHelper,
    formattedErrorBuilder,
    formattedTimeBuilder,
} from "./utils";
import * as vibe from "@pyke/vibe";


const configHelper = new ConfigHelper(path.join(__dirname, "../config.json"));
const webServer = express();
const server = new http.Server(webServer);
const clientId = "995095535709081670";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
let Mainwindow: BrowserWindow;
let Settingswindow;
let WindowCloseState = false
const tray: Tray = null;
const info: VideoMetadata = {
    video: {
        creator: "WatchRPC v3",
        title: "Waiting for REST API",
        views: "",
        likes: "",
        thumbnail: "ytlogo",
        url: "https://waterwolf.tk",
    },
    time: {
        curruntTime: 0,
        totalTime: 0,
        timePercent: 0,
        formattedTime: "",
    },
    extra: {
        platform: "",
        uuid: "",
        browser: "",
    },
};

webServer.use(bodyParser.json());
console.clear = () => {
    console.log("\x033[2J \x033[H \x033c ");
}; //since console.clear() stil doesn't work on windows :face_palm:

function createWindow() {
    Mainwindow = new BrowserWindow({
        width: 425,
        height: 260,
        resizable: false,
        backgroundColor: "#000000ff",
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        autoHideMenuBar: true,
        frame: true,
        icon: path.join(__dirname, "../build","YTlogo4.png")
    });


    Mainwindow.loadFile(path.join(__dirname, "../app/index.html"));
    Mainwindow.setBackgroundColor('#000000ff');

    if (!tray) {
        positron.createBasicTray(tray, Mainwindow);
    }
    // vibe.applyEffect(Mainwindow, 'acrylic');
    vibe.applyEffect(Mainwindow, "acrylic");
    Mainwindow.webContents.once("dom-ready", () => {
        Mainwindow.setBackgroundColor("#000000ff");
    });
    Mainwindow.on("closed", () => {
        Mainwindow = null;
    });
    Mainwindow.on("close",(e) => {
        console.log(e);
        WindowCloseState ? console.log() : e.preventDefault();
        dialog.showMessageBox(positron.closedialogSettings).then((result) => {
            if (result.response){
                WindowCloseState = true;
                app.quit();
            }else{
                BrowserWindow.getFocusedWindow().hide();
            }
        });
    })

}

function createWindow2() {
    Settingswindow = new BrowserWindow({
        width: 600,
        height: 600,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        frame: false,
    });
    Settingswindow.loadFile(path.join(__dirname, "../app/settings.html"));
}

ipcMain.handle("winControls", (_event, arg) => {
    positron.handleWinControls(arg);
});


ipcMain.handle("settings", (_event, _arg) => {
    console.log(configHelper.getFull());
    console.log(`[ipcMain] [settings] > settings`);
    createWindow2();
});

ipcMain.handle("setOptions", (event, args) => {
    if (configHelper.get("mode") !== args.Service) {
        info.time.curruntTime = 0;
        info.time.totalTime = 0;
        info.time.timePercent = 0;
        info.time.formattedTime = formattedTimeBuilder(0, 0);
        // sendUpdate()
    }
    configHelper.set("mode", args.Service);
    configHelper.set("showTTY", args.showTTy);
    configHelper.set("useVideoThumbnails", args.useVideoThumbnails);
});

webServer.post("/data/:uuid/:service", (req, res) => {
    if (info.extra.uuid == "") {
        info.extra.uuid = req.params.uuid;
    }
    if (info.extra.uuid !== req.params.uuid) {
        return;
    }
    if (configHelper.get("mode") !== req.params.service) {
        return;
    }
    info.video = req.body;
    console.log(req.body);
    res.send({ OK: true });
});

webServer.post("/open/:uuid/:service", (req, res) => {
    if (info.extra.uuid == "") {
        info.extra.uuid = req.params.uuid;
        console.log("waiting for close request");
        res.send(formattedErrorBuilder("/open", 0));
    } else {
        console.log("can't change source");
        res.send(formattedErrorBuilder("/open", 0));
    }
    console.log(`UUID: ${req.params.uuid}`);
    res.send({ OK: true });
});

webServer.post("/close/:uuid/:service", (req, res) => {
    if (info.extra.uuid !== req.params.uuid) {
        res.send(formattedErrorBuilder("/close", 0));
        return;
    }
    if (info.extra.uuid == "") {
        console.log("no source to quit");
        res.send({ OK: true });
    } else {
        console.log("got close request");
        info.extra.uuid = "";
        info.extra.platform = "";
        res.send({ OK: true });
        info.video.title == "Waiting for REST API";
    }
    res.send({ OK: true });
});

webServer.post("/time/:uuid/:service", (req, res) => {
    console.log(`${info.extra.uuid}  |  ${req.params.uuid}`);
    if (info.extra.uuid == "") {
        info.extra.uuid = req.params.uuid;
    }
    if (info.extra.uuid !== req.params.uuid) {
        res.send(formattedErrorBuilder("/time", 0));
        return;
    }
    if (configHelper.get("mode") !== req.params.service) {
        res.send(formattedErrorBuilder("/time", 0));
        return;
    }
    info.time = req.body;
    // console.log(req.body)
    //we should do hot reloads before sending a update
    if (info.video.title == "Waiting for REST API" || info.video.title == "") {
        res.send(formattedErrorBuilder("/time", 2));
        return;
    }
    sendUpdate();
    res.send({ OK: true });
});

vibe.setup(app);

app.whenReady().then(() => {
    createWindow();
});

ipcMain.handle("getOptions", () => {
    return configHelper.getFull();
}); //nconf.get()
ipcMain.handle("forceRefresh", () => {
    Mainwindow.reload();
});

//DISCORD RPC
DiscordRPC.register(clientId);
rpc.on("ready", () => {
    console.log("Logged in as", rpc.user.username);
    setActivity();
});

async function setActivity() {
    rpc.setActivity({
        details: "Waiting For REST API",
        largeImageKey: "ytlogo4",
        instance: false,
    });
}

function sendUpdate() {
    // code to refresh RPC and send update to gui
    rpc.setActivity({
        details: `${info.video.title} ${info.time.formattedTime}`,
        state: `By ${info.video.creator}`,
        largeImageKey: `${info.video.thumbnail}`,
        smallImageKey: `ytlogo4`,
        smallImageText: "WatchRPC v3 (Beta)",
        largeImageText: `${info.time.formattedTime} | ${Math.round(
            info.time.timePercent,
        )}%`,
        buttons: [{ label: "Watch Video", url: `${info.video.url}` }],
        instance: false,
    });
    console.log(info);
    Mainwindow.webContents.send("infoUpdate", info);
}

//DISCORD RPC
server.listen(9494, () => {
    console.log(`Server listening on port 9494`);
    rpc.login({ clientId }).catch((err) => {
        console.error(err);
    });
});