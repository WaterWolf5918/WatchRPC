/* eslint-disable @typescript-eslint/ban-ts-comment */
// if(require('electron-squirrel-startup')) return;
if (require("electron-squirrel-startup")) process.exit();
import DiscordRPC = require("discord-rpc");
import path from "path";
import positron = require("./positron");
import { app, BrowserWindow, dialog, ipcMain, nativeImage, Tray } from "electron";
import { ConfigHelper } from "./utils";
import { infoStore } from "./infoStore";
import { restSetup } from "./restServ";

export const store = new infoStore()
export const configStore = new ConfigHelper(path.join(__dirname, "../config.json"));
const clientId = "995095535709081670";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
let Mainwindow: BrowserWindow;
let Settingswindow;
let WindowCloseState = false
const tray: Tray = null;


console.clear = () => {
    console.log("\x033[2J \x033[H \x033c ");
}; //since console.clear() stil doesn't work on windows :face_palm:

function createWindow() {
    Mainwindow = new BrowserWindow({
        width: 425,
        height: 260,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        autoHideMenuBar: true,
        frame: true,
        icon: path.join(__dirname, "../build","YTlogo4.png"),
        transparent: true,
    });

    Mainwindow.loadFile(path.join(__dirname, "../app/index.html"));
    if (!tray) { positron.createBasicTray(tray, Mainwindow); }
    Mainwindow.webContents.once("dom-ready", () => {
        Mainwindow.setBackgroundColor("#000000ff");
        Mainwindow.setBackgroundMaterial("acrylic");
    });

    Mainwindow.on("close",(e) => {
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
    console.log(configStore.getFull());
    console.log(`[ipcMain] [settings] > settings`);
    createWindow2();
});

ipcMain.handle("setOptions", (event, args) => {
    if (configStore.get("mode") !== args.Service) {
        store.blank();
    }
    configStore.set("mode", args.Service);
    configStore.set("showTTY", args.showTTy);
    configStore.set("useVideoThumbnails", args.useVideoThumbnails);
});

ipcMain.handle("getOptions", () => {
    return configStore.getFull();
});

ipcMain.handle("forceRefresh", () => {
    Mainwindow.reload();
});


app.whenReady().then(() => {
    createWindow();
});


store.events.on("infoUpdated",(info) => {
    rpc.setActivity({
        details: `${store.info.video.title} ${store.info.time.formattedTime}`,
        state: `By ${store.info.video.creator}`,
        largeImageKey: `${store.info.video.thumbnail}`,
        smallImageKey: `ytlogo4`,
        smallImageText: "WatchRPC v3 (Beta)",
        largeImageText: `${store.info.time.formattedTime} | ${Math.round(
            store.info.time.timePercent,
        )}%`,
        buttons: [{ label: "Watch Video", url: `${store.info.video.url}` }],
        instance: false,
    });
    Mainwindow.webContents.send("infoUpdate", store.info);
});

//DISCORD RPC

async function setActivity() {
    rpc.setActivity({
        details: "Waiting For REST API",
        largeImageKey: "ytlogo4",
        instance: false,
    });
};

DiscordRPC.register(clientId);
rpc.on("ready", () => {
    console.log(`[DiscordRPC] Logged in as ${rpc.user.username}`);
    setActivity();
});

rpc.login({ clientId }).catch((err) => {
    console.error(`[DiscordRPC] ${err}`);
    throw new Error("[DiscordRPC] RPC login failed");
})
.then(() => {
    restSetup();
});