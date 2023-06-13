import express from "express";
import http from "http";
import bodyParser = require("body-parser");
import { formattedErrorBuilder } from "./utils";
import { configStore,store } from "./main";

const webServer = express();
const server = new http.Server(webServer);

webServer.use(bodyParser.json());
webServer.post("/data/:uuid/:service", (req, res) => {
    if (store.nullUUID()) {
        store.setUUID(req.params.uuid)
    }
    if (store.notMatchUUID(req.params.uuid)) {
        return;
    }
    
    if (configStore.get("mode") !== req.params.service) {
        return;
    }
    store.setVideo(req.body)
    // info.video = req.body;
    res.send({ OK: true });
});

webServer.post("/open/:uuid/:service", (req, res) => {
    if (store.nullUUID()) {
        store.setUUID(req.params.uuid)
        console.log("[restServ] Waiting for close request");
        res.send(formattedErrorBuilder("/open", 0));
    } else {
        console.log("[restServ] Can't change source");
        res.send(formattedErrorBuilder("/open", 0));
    }
    res.send({ OK: true });
});

webServer.post("/close/:uuid/:service", (req, res) => {
    if (store.notMatchUUID(req.params.uuid)) {
        res.send(formattedErrorBuilder("/close", 0));
        return;
    }
    if (store.nullUUID()) {
        console.log("[restServ] No source to quit");
        res.send({ OK: true });
    } else {
        console.log("[restServ] Got close request");
        store.blank()
        res.send({ OK: true });
    }
    res.send({ OK: true });
});

webServer.post("/time/:uuid/:service", (req, res) => {
    if (store.nullUUID()) {
        store.info.extra.uuid = req.params.uuid;
    }
    if (store.notMatchUUID(req.params.uuid)) {
        res.send(formattedErrorBuilder("/time", 0));
        return;
    }
    if (configStore.get("mode") !== req.params.service) {
        res.send(formattedErrorBuilder("/time", 0));
        return;
    }
    store.setTime(req.body)
    //we should do hot reloads before sending a update
    if (store.info.video.title == "Waiting for REST API" || store.info.video.title == "") {
        res.send(formattedErrorBuilder("/time", 2));
        return;
    }
    res.send({ OK: true });
});


export function restSetup(){
    server.listen(9494, () => {
        console.log(`[restServ] Server listening on port 9494`);
    });
}


