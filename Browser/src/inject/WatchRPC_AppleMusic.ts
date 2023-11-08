// @ts-ignore-start
const GetSongImgElement = () => 
(document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll(".lcd__artwork-img")[0] as HTMLImageElement).src
const GetSongElapsedTime = () => 
(document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll("time.lcd-progress__time:nth-child(1)")[0] as HTMLDivElement).innerText
const GetSongRemainingTime  = () => 
(document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll("time.lcd-progress__time:nth-child(2)")[0] as HTMLDivElement).innerText
const GetTotalTime = () => "potato"
const GetTitle = () => 
(document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll(".lcd-meta__primary > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)")[0] as HTMLDivElement).innerText
const GetAuther = () => 
(document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll(".lcd-meta__secondary > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)")[0] as HTMLDivElement).innerText.split("\n")[0]
//@ts-ignore-end
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
        service: "applemusic",
    },
};
let ready: boolean = false

console.log("\n\nIf your reading this WatchRPC for apple music has loaded :)\n\n");

const spotConfig = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
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
        url: "music.apple.com",
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
        if(typeof(document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll(".lcd-meta__primary > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)")[0]) !== "object"){
            
            // console.log(typeof(document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll(".lcd-meta__primary > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)")[0]))
        }else{
            console.log("[WatchRPC] Song Change Event Watcher Loaded")
            // Object.defineProperty(document, "hidden", { value : false});
            ready = true
            clearInterval(t)
            const spotTarget = document.getElementsByClassName("svelte-18bi8gg lcd lcd__music")[0].shadowRoot.querySelectorAll(".lcd-meta__primary > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)")[0]
            spotObserver.observe(spotTarget, spotConfig);

            setTimeout(() => {
                info.video = {
                    title: GetTitle(),
                    creator: GetAuther(),
                    views: "0",
                    likes: "0",
                    url: "music.apple.com",
                    thumbnail: GetSongImgElement(),
                };
                // give the page a few seconds to load
            },2000)
        }
    },1000)
});


function timeBuilder(time){
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes}:${seconds}`
}

let timer2 = setInterval(() => {
    if (!ready){
        return
    }
    let curruntTime: number | string[];
    let elapsedTime: number | string[];
    let totalTime: number | string[];
    let remainingTime: number | string[];
    let timeP: number;
    // Get time and split the mins and seconds
    remainingTime = GetSongRemainingTime().split('-')[1].split(":");
    elapsedTime = GetSongElapsedTime().split(":");
    // make it into only seconds since otherwise PAIN
    remainingTime = parseInt(remainingTime[0]) * 60 + parseInt(remainingTime[1]);
    elapsedTime = parseInt(elapsedTime[0]) * 60 + parseInt(elapsedTime[1]);
    // Add elapsedTime and currentTime since apple doesn't have total time on the site :sob:
    totalTime = elapsedTime + remainingTime
    

    timeP = (elapsedTime / totalTime) * 100;
    info.time = {
        curruntTime: remainingTime,
        totalTime: totalTime,
        timePercent: timeP,
        formattedTime: `${GetSongElapsedTime()} / ${timeBuilder(totalTime)}`
    };
    console.log(info.time)
    console.log(info)
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
    switch (mail.type) {
        case "getVideoData":
            console.log(mail)
            if(mail.message.service !== info.extra.service){
                return
            }
            if(!info.video.title || info.video.title == "" || info.video.title == " "){
                //there is no data to send :sob:
                info.video = {
                    title: GetTitle(),
                    creator: GetAuther(),
                    views: "0",
                    likes: "0",
                    url: "music.apple.com",
                    thumbnail: GetSongImgElement(),
                };
                console.log("potato")
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
            { type: "unload", data: { service: info.extra.service }, uuid: info.extra.uuid },
            async (response) => {
                console.log("[WatchRPC] [Content Script] received: ", response);
            },
        );
});
