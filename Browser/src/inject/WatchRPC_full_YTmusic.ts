console.log('\n\nIf your reading this WatchRPC for YTmusic has loaded :)\n\n')
//WIP regex (.*?) • (?<= • )(.*?)(?= • )
let info = {}
//@ts-expect-error
let timeData: any
//@ts-expect-error
let videoData: any
const target_title = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0];
const config = { attributes: true, childList: true, subtree: true,timeout:-1 };
const observer = new MutationObserver((mutationList, observer) => {
	//@ts-expect-error
	let title = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0].title;
	let other = document.getElementsByClassName("subtitle style-scope ytmusic-player-bar")[0].textContent;
	other = other.split('\n')[2]
	other = other.split('          ')[1]
	console.log(other);
	console.log(typeof(other))

	let creator = other.split(' • ')[0]
	let views = other.split(' • ')[1]
	let likes = other.split(' • ')[2]
	console.log(`[YoutubeRPC] Stuff changed ${mutationList} ${observer}`)
	console.log(`[YoutubeRPC] All info ${title} ${creator} ${views} ${likes}`)
	console.log(`====================\n${title}\nBy ${creator}\n${views} ${likes}\n====================`)
	videoData = {
		"title": title,
		"creater": creator,
		"views": views,
		"likes": likes,
		"url": window.location.href,
		//@ts-expect-error
		"thumbnail": document.getElementsByClassName("image style-scope ytmusic-player-bar")[0].src,
		"services": "ytmusic",
		"time": timeData
	}

	chrome.runtime.sendMessage({type:"videodata",data: videoData }, async(response) => {
		// console.log('[WatchRPC] [Content Script] received: ', response);
	});
});
observer.observe(target_title, config);

setInterval(() => {
	//@ts-expect-error
	globalThis.videotime = document.getElementsByClassName("time-info style-scope ytmusic-player-bar")[0].innerText
	let videotime2: string[]
	let curruntTime: number | string[]
	let totalTime: number | string[]
	let timeP: number

	videotime2 = globalThis.videotime.split(" / ")
	curruntTime = videotime2[0].split(":")
	totalTime = videotime2[1].split(':')
	curruntTime = parseInt(curruntTime[0]) * 60 + parseInt(curruntTime[1])
	totalTime = parseInt(totalTime[0]) * 60 + parseInt(totalTime[1])
	timeP = curruntTime / totalTime * 100
	timeData = {
		"curruntTime": curruntTime,
		"totalTime": totalTime,
		"timeP": timeP,
		"formatedTime": [globalThis.videotime.split(" / ")[0],globalThis.videotime.split(" / ")[1]],
		"service": "ytmusic"
	}


	chrome.runtime.sendMessage({type:"timedata",data: timeData }, async(response) => {
		// console.log('[WatchRPC] [Content Script] received: ', response);
	});
}, 1000);



chrome.runtime.onMessage.addListener((mail,sender,send) => {
	console.log(mail)
	switch(mail.type){
		case "getVideoData":
			send(videoData)
			break
		default:
		send("malformed data")
	}
})