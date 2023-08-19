const GetSongImgElement = () => 
(document.getElementsByClassName("mMx2LUixlnN_Fu45JpFB FqmFsMhuF4D0s35Z62Js Yn2Ei5QZn19gria6LjZj")[0] as HTMLImageElement).src
const GetSongElapsedTime = () => 
(document.getElementsByClassName("Type__TypeElement-sc-goli3j-0 fcYQUS playback-bar__progress-time-elapsed")[0] as HTMLDivElement).innerText
const GetTotalTime = () => 
(document.getElementsByClassName("Type__TypeElement-sc-goli3j-0 fcYQUS npFSJSO1wsu3mEEGb5bh")[0] as HTMLDivElement).innerText
const GetTitle = () => 
(document.getElementsByClassName("Type__TypeElement-sc-goli3j-0 ieTwfQ Q_174taY6n64ZGC3GsKj")[0] as HTMLDivElement).innerText
const GetAuther = () => 
(document.getElementsByClassName("Type__TypeElement-sc-goli3j-0 fcYQUS gpNta6i8q3KYJC6WBZQC")[0] as HTMLDivElement).innerText
//@ts-ignore
let info: VideoMetadata = {
    video: {
        creator: "",
        title: "",
        views: "",
        likes: "",
        thumbnail: "",
        url: "",
    },
    time: {
        curruntTime: 0,
        totalTime: 0,
        timePercent: 0,
        formattedTime: "",
    },
    extra: {
        uuid: crypto.randomUUID(),
        service: "spotify",
    },
};


console.log("\n\nIf your reading this WatchRPC for spotify has loaded :)\n\n");

const spotTarget = document.getElementsByClassName(
    "mMx2LUixlnN_Fu45JpFB FqmFsMhuF4D0s35Z62Js Yn2Ei5QZn19gria6LjZj",
)[0];
console.log(typeof(spotTarget))
const spotConfig = {
    attributes: true,
    childList: true,
    subtree: true,
    timeout: -1,
};
const spotObserver = new MutationObserver((mutationList, observer) => {
    console.group("test")
    console.log("[WatchRPC] Got Mutation")
    console.log(mutationList)
    console.groupEnd()
    let title = GetTitle();
    let creator = GetAuther();
    let views = "0";
    let likes = "0";
    console.log(`[YoutubeRPC] Stuff changed ${mutationList} ${observer}`);
    console.log(`[YoutubeRPC] All info ${title} ${creator} ${views} ${likes}`);
    console.log(
        `====================\n${title}\nBy ${creator}\n${views} ${likes}\n====================`,
    );
    info.video = {
        title: title,
        creator: creator,
        views: views,
        likes: likes,
        url: window.location.href,
        thumbnail: GetSongImgElement(),
    };
    chrome.runtime.sendMessage(
        {
            type: "videodata",
            data: info.video,
            uuid: info.extra.uuid,
            service: info.extra.service,
        },
        async (response) => {
            // console.log('[WatchRPC] [Content Script] received: ', response);
        },
    );
});
//@ts-ignore
addEventListener("DOMContentLoaded", (event) => {
    console.log(event);
    var t = setInterval(() => {
        console.log("[WatchRPC] Song Change Event Watcher Loaded")
        if(typeof(document.getElementsByClassName("mMx2LUixlnN_Fu45JpFB FqmFsMhuF4D0s35Z62Js Yn2Ei5QZn19gria6LjZj")[0]) !== "object"){
            console.log("1")
            console.log(typeof(document.getElementsByClassName("mMx2LUixlnN_Fu45JpFB FqmFsMhuF4D0s35Z62Js Yn2Ei5QZn19gria6LjZj")[0]))
        }else{
            clearInterval(t)
            const spotTarget = document.getElementsByClassName("mMx2LUixlnN_Fu45JpFB FqmFsMhuF4D0s35Z62Js Yn2Ei5QZn19gria6LjZj")[0];
            spotObserver.observe(spotTarget, spotConfig);
            info.video = {
                title: GetTitle(),
                creator: GetAuther(),
                views: "0",
                likes: "0",
                url: window.location.href,
                thumbnail: GetSongImgElement(),
            };
        }
    },1000)
});

let timer2 = setInterval(() => {

    let curruntTime: number | string[];
    let totalTime: number | string[];
    curruntTime = GetSongElapsedTime().split(":");
    totalTime = GetTotalTime().split(":");
    curruntTime = parseInt(curruntTime[0]) * 60 + parseInt(curruntTime[1]);
    totalTime = parseInt(totalTime[0]) * 60 + parseInt(totalTime[1]);
    let videotime2: string[];
    // let curruntTime: number | string[];
    // let totalTime: number | string[];
    let timeP: number;
    timeP = (curruntTime / totalTime) * 100;
    info.time = {
        curruntTime: curruntTime,
        totalTime: totalTime,
        timePercent: timeP,
        formattedTime: `${GetSongElapsedTime()} / ${GetTotalTime()}`
    };
    console.log(info.time)

    chrome.runtime.sendMessage(
        {
            type: "timedata",
            data: info.time,
            uuid: info.extra.uuid,
            service: info.extra.service,
        },
        async (response) => {
            console.log("[WatchRPC] [Content Script] received: ", response);
        },
    );
}, 1000);

chrome.runtime.onMessage.addListener((mail, sender, send) => {
    console.log(mail);
    switch (mail.type) {
        case "getVideoData":
            console.log(mail.message)
            if(mail.message.service !== info.extra.service){
                return
            }
            send(info);
            break;
        default:
            send("malformed data");
    }
});

window.addEventListener("unload", (e) => {
    clearInterval(timer);
    observer.disconnect();
        chrome.runtime.sendMessage(
            { type: "unload", data: { service: "ytmusic" }, uuid: info.extra.uuid },
            async (response) => {
                console.log("[WatchRPC] [Content Script] received: ", response);
            },
        );
});
