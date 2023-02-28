console.log('\n\nIf your reading this WatchRPC for YTmusic has loaded :)\n\n');
//WIP regex (.*?) • (?<= • )(.*?)(?= • )
//@ts-expect-error
let info = {
    video: {
        creator: "",
        title: "",
        views: "",
        likes: "",
        thumbnail: "",
        url: ""
    },
    time: {
        curruntTime: 0,
        totalTime: 0,
        timePercent: 0,
        formattedTime: ""
    },
    extra: {
        uuid: "",
    }
};
const target_title = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0];
const config = { attributes: true, childList: true, subtree: true, timeout: -1 };
const observer = new MutationObserver((mutationList, observer) => {
    //@ts-expect-error
    let title = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0].title;
    let other = document.getElementsByClassName("subtitle style-scope ytmusic-player-bar")[0].textContent;
    other = other.split('\n')[2];
    other = other.split('          ')[1];
    console.log(other);
    console.log(typeof (other));
    let creator = other.split(' • ')[0];
    let views = other.split(' • ')[1];
    let likes = other.split(' • ')[2];
    console.log(`[YoutubeRPC] Stuff changed ${mutationList} ${observer}`);
    console.log(`[YoutubeRPC] All info ${title} ${creator} ${views} ${likes}`);
    console.log(`====================\n${title}\nBy ${creator}\n${views} ${likes}\n====================`);
    info.video = {
        "title": title,
        "creator": creator,
        "views": views,
        "likes": likes,
        "url": window.location.href,
        //@ts-expect-error
        "thumbnail": document.getElementsByClassName("image style-scope ytmusic-player-bar")[0].src
    };
    chrome.runtime.sendMessage({ type: "videodata", data: info.video }, async (response) => {
        // console.log('[WatchRPC] [Content Script] received: ', response);
    });
});
observer.observe(target_title, config);
setInterval(() => {
    //@ts-expect-error
    videotime = document.getElementsByClassName("time-info style-scope ytmusic-player-bar")[0].innerText;
    let videotime2;
    let curruntTime;
    let totalTime;
    let timeP;
    videotime2 = globalThis.videotime.split(" / ");
    curruntTime = videotime2[0].split(":");
    totalTime = videotime2[1].split(':');
    curruntTime = parseInt(curruntTime[0]) * 60 + parseInt(curruntTime[1]);
    totalTime = parseInt(totalTime[0]) * 60 + parseInt(totalTime[1]);
    timeP = curruntTime / totalTime * 100;
    info.time = {
        "curruntTime": curruntTime,
        "totalTime": totalTime,
        "timePercent": timeP,
        "formattedTime": `${globalThis.videotime.split(" / ")[0]} / ${globalThis.videotime.split(" / ")[1]}`,
    };
    chrome.runtime.sendMessage({ type: "timedata", data: info.time }, async (response) => {
        // console.log('[WatchRPC] [Content Script] received: ', response);
    });
}, 1000);
chrome.runtime.onMessage.addListener((mail, sender, send) => {
    console.log(mail);
    switch (mail.type) {
        case "getVideoData":
            send(info.video);
            break;
        default:
            send("malformed data");
    }
});
