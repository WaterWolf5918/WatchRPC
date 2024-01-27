/* eslint-disable @typescript-eslint/ban-ts-comment */
// if(require('electron-squirrel-startup')) return;
if (require('electron-squirrel-startup')) process.exit();
import * as DiscordRPC from 'discord-rpc';
import path from 'path';
import * as positron from './positron';
import { app, BrowserWindow, dialog, ipcMain, Menu, Tray } from 'electron';
import { ConfigHelper } from './utils';
import { infoStore } from './infoStore';
import { restSetup } from './restServ';
export const store = new infoStore();
export const configStore = new ConfigHelper(path.join(__dirname, '../config.json'));
const clientId = '995095535709081670';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
let Mainwindow: BrowserWindow;
let Settingswindow;
let WindowCloseState = false;
let cleared = false;
const tray: Tray = null;


console.clear = () => {
    console.log('\x033[2J \x033[H \x033c ');
}; //since console.clear() stil doesn't work on windows :face_palm:




function createWindow() {
    Mainwindow = new BrowserWindow({
        width: 425,
        height: 280,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        // autoHideMenuBar: true,
        frame: true,
        icon: path.join(__dirname, '../build', 'YTlogo4.png'),
        transparent: true,
        focusable: false
    });
    Mainwindow.loadFile(path.join(__dirname, '../app/index.html'));
    if (!tray) { positron.createBasicTray(tray, Mainwindow); }
    Mainwindow.webContents.once('dom-ready', () => {
        Mainwindow.setBackgroundColor('#000000ff');
        Mainwindow.setBackgroundMaterial('acrylic');
    });

    Mainwindow.on('close', (e) => {
        WindowCloseState ? console.log() : e.preventDefault();
        dialog.showMessageBox(positron.closedialogSettings).then((result) => {
            if (result.response) {
                WindowCloseState = true;
                app.quit();
            } else {
                BrowserWindow.getFocusedWindow().hide();
            }
        });
    });
}

function createWindow2() {
    Settingswindow = new BrowserWindow({
        width: 600,
        height: 600,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: true,
        backgroundMaterial: 'tabbed',
        autoHideMenuBar: true,
        transparent: true
    });
    Settingswindow.loadFile(path.join(__dirname, '../app/settings.html'));
    Settingswindow.setBackgroundMaterial('tabbed');
}

ipcMain.handle('setTheme', (_event, arg) => {
    configStore.set('theme', arg);
});

ipcMain.handle('getTheme', () => {
    return configStore.get('theme');
});


ipcMain.handle('winControls', (_event, arg) => {
    positron.handleWinControls(arg);
});


ipcMain.handle('settings', (_event, _arg) => {
    console.log(configStore.getFull());
    console.log('[ipcMain] [settings] > settings');
    createWindow2();
});

ipcMain.handle('setOptions', (_event, args) => {
    if (configStore.get('mode') !== args.service) {
        store.blank();
    }
    configStore.set('mode', args.service);
    configStore.set('showTTY', args.showTTy);
    configStore.set('errNote', args.errNote);
    configStore.set('RPCServer', args.RPCServer);

});

ipcMain.handle('getOptions', () => {
    return configStore.getFull();
});

ipcMain.handle('forceRefresh', () => {
    Mainwindow.reload();
});


app.whenReady().then(() => {
    createWindow();
});


store.events.on('infoUpdated', () => {
    Mainwindow.webContents.send('infoUpdate', store.info);
    if(!configStore.get('RPCServer')){
        if(!cleared){
            rpc.clearActivity();
            cleared = true;
        }
        return;
    }else{
        rpc.setActivity({
            details: `${store.info.video.title} ${store.info.time.formattedTime}`,
            state: `By ${store.info.video.creator}`,
            largeImageKey: `${store.info.video.thumbnail}`,
            smallImageKey: 'ytlogo4',
            smallImageText: 'WatchRPC v3 (Beta)',
            largeImageText: `${store.info.time.formattedTime} | ${Math.round(
                store.info.time.timePercent,
            )}%`,
            buttons: [{ label: 'Watch Video', url: `${store.info.video.url}` }],
            instance: false,
        }).catch((err) => {
            console.warn(`[ERROR]: ${err}`);
            // PushError("[DiscordRPC] setActivity Failed.",err.toString())
        });
        cleared = false;
    }

    
    
});

//DISCORD RPC

async function setActivity() {
    rpc.setActivity({
        details: 'Waiting For REST API',
        largeImageKey: 'ytlogo4',
        instance: false,
    });
}

DiscordRPC.register(clientId);
rpc.on('ready', () => {
    console.log(`[DiscordRPC] Logged in as ${rpc.user.username}`);
    setActivity();
});

rpc.on('error', () => {
    console.log('Somthing is burning ahhhhhhhhhh');
});

rpc.on('close', () => {
    // PushError("[DiscordRPC] Connection Failed.","IPC disconnected")
    throw new Error('[DiscordRPC] Connection Failed.');
});


rpc.login({ clientId }).catch(() => {
    // PushError("[DiscordRPC] RPC login failed. Is discord open ?",err.toString())
    throw new Error('[DiscordRPC] RPC login failed');
}).then(() => {
    restSetup();
});


