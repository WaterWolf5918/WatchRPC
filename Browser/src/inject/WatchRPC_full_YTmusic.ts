console.log("\n\nIf your reading this WatchRPC for YTmusic has loaded :)\n\n");

//WIP regex (.*?) • (?<= • )(.*?)(?= • )
//@ts-expect-error
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
        service: "ytmusic",
    },
};


const target_title = document.getElementsByClassName(
    "title style-scope ytmusic-player-bar",
)[0];
const config = {
    attributes: true,
    childList: true,
    subtree: true,
    timeout: -1,
};
const observer = new MutationObserver((mutationList, observer) => {
    let title = (<HTMLParagraphElement>document.getElementsByClassName("title style-scope ytmusic-player-bar",)[0]).title;
    let other = document.getElementsByClassName(
        "subtitle style-scope ytmusic-player-bar",
    )[0].textContent;
    other = other.split("\n")[2];
    other = other.split("          ")[1];
    console.log(other);
    console.log(typeof other);

    let creator = other.split(" • ")[0];
    let views = other.split(" • ")[1];
    let likes = other.split(" • ")[2];
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
        thumbnail: (<HTMLImageElement>document.getElementsByClassName("image style-scope ytmusic-player-bar",)[0]).src,
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
observer.observe(target_title, config);

let timer = setInterval(() => {
    //@ts-expect-error
    videotime = document.getElementsByClassName("time-info style-scope ytmusic-player-bar",)[0].innerText;
    let videotime2: string[];
    let curruntTime: number | string[];
    let totalTime: number | string[];
    let timeP: number;

    videotime2 = globalThis.videotime.split(" / ");
    curruntTime = videotime2[0].split(":");
    totalTime = videotime2[1].split(":");
    curruntTime = parseInt(curruntTime[0]) * 60 + parseInt(curruntTime[1]);
    totalTime = parseInt(totalTime[0]) * 60 + parseInt(totalTime[1]);
    timeP = (curruntTime / totalTime) * 100;
    info.time = {
        curruntTime: curruntTime,
        totalTime: totalTime,
        timePercent: timeP,
        formattedTime: `${globalThis.videotime.split(" / ")[0]} / ${
            globalThis.videotime.split(" / ")[1]
        }`,
    };
    console.log(globalThis.videotime.split(" / "));

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
