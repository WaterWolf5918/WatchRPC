import express from 'express';
import http from 'http';
import bodyParser = require('body-parser');
import { formattedErrorBuilder } from './utils';
import { configStore,store } from './main';
import { WebSocketServer } from 'ws';

const webServer = express();
const server = new http.Server(webServer);
const wss = new WebSocketServer({ server });

webServer.use(bodyParser.json());
webServer.post('/data/:uuid/:service', (req, res) => {
    if (store.nullUUID()) {
        store.setUUID(req.params.uuid);
    }
    if (store.notMatchUUID(req.params.uuid)) {
        return;
    }
    
    if (configStore.get('mode') !== req.params.service) {
        return;
    }
    store.setVideo(req.body);
    // info.video = req.body;
    res.send({ OK: true });
});

webServer.post('/open/:uuid/:service', (req, res) => {
    if (store.nullUUID()) {
        store.setUUID(req.params.uuid);
        console.log('[restServ] Waiting for close request');
        res.send(formattedErrorBuilder('/open', 0));
    } else {
        console.log('[restServ] Can\'t change source');
        res.send(formattedErrorBuilder('/open', 0));
    }
    res.send({ OK: true });
});

webServer.post('/close/:uuid/:service', (req, res) => {
    if (store.notMatchUUID(req.params.uuid)) {
        res.send(formattedErrorBuilder('/close', 0));
        return;
    }
    if (store.nullUUID()) {
        console.log('[restServ] No source to quit');
        res.send({ OK: true });
    } else {
        console.log('[restServ] Got close request');
        store.blank();
        res.send({ OK: true });
    }
    res.send({ OK: true });
});

webServer.post('/time/:uuid/:service', (req, res) => {
    console.log(req.body + '|' + req.params);
    if (store.nullUUID()) {
        store.info.extra.uuid = req.params.uuid;
    }
    if (store.notMatchUUID(req.params.uuid)) {
        res.send(formattedErrorBuilder('/time', 0));
        return;
    }
    if (configStore.get('mode') !== req.params.service) {
        res.send(formattedErrorBuilder('/time', 0));
        return;
    }
    store.setTime(req.body);
    //we should do hot reloads before sending a update
    // console.log(store.info.video.title);
    if (store.info.video.title == 'Waiting for REST API' || store.info.video.title == '') {
        res.send(formattedErrorBuilder('/time', 2));
        return;
    }
    console.log(req.body);
    res.send({ OK: true });
});

// Websockets \\
wss.on('connection', function connection(ws) {
    let lastMessage = 0;
    ws.on('error', console.error);
  
    ws.on('message', (data) => {
        console.log(`[wss] got: ${data}`);
    });

    store.events.on('infoUpdated',() => {
        const now = new Date().getTime() / 1000;
        if (lastMessage == 0 || now - lastMessage >= 5){
            console.log('potato');

            let app;
            switch(store.info.extra.platform){
            case 'applemusic':
                app = 'Apple Music';
                break;
            case 'spotify': 
                app = 'Spotify';
                break;
            case 'ytmusic':
                app = 'Youtube Music';
                break;
            }
            
    
            const json = {
                event: 'setActivity',
                app: app,
                state: `By ${store.info.video.creator}`,
                details: `${store.info.video.title} ${store.info.time.formattedTime}`,
                largeImageKey: `${store.info.video.thumbnail}`,
                smallImageKey: 'ytlogo4',
                smallImageText: 'WatchRPC Plugin',
                largeImageText: `${store.info.time.formattedTime} | ${Math.round(
                    store.info.time.timePercent,
                )}%`,
            };
            ws.send(JSON.stringify(json));
            lastMessage = new Date().getTime() / 1000;
        }
    });
    ws.send('something');
});

export function restSetup(){
    server.listen(9494, () => {
        console.log('[restServ] Server listening on port 9494');
    });
}


