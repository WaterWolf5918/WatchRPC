import { VideoMetadata } from "./utils"; //4
import { EventEmitter } from "events";
export class infoStore {
    events = new EventEmitter()
    info: VideoMetadata = {
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
    constructor() { }

    setVideo(video: VideoMetadata["video"]) {
        this.info.video = video
        this.events.emit("videoUpdated", video)
        this.events.emit("infoUpdated", this.info)
    }


    setTime(time: VideoMetadata["time"]) {
        this.info.time = time
        this.events.emit("timeUpdated", time)
        this.events.emit("infoUpdated", this.info)
    }


    setExtra(extra: VideoMetadata["extra"]) {
        this.info.extra = extra
        this.events.emit("extraUpdated", extra)
        this.events.emit("infoUpdated", this.info)
    }


    notMatchUUID(uuid) { //checks if the uuid provided matches the saved uuid, if it doesn't match it returns true
        if (this.info.extra.uuid !== uuid) return true
    }

    nullUUID() {
        if (this.info.extra.uuid == "") return true
    }

    setUUID(uuid) {
        this.info.extra.uuid = uuid
    }


    blank() {
        this.info = {
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
    }
}