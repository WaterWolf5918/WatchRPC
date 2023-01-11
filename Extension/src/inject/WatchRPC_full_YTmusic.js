console.log('\n\nIf your reading this WatchRPC for YTmusic has loaded :)\n\n')
//WIP regex (.*?) • (?<= • )(.*?)(?= • )
let info = {}
let timeData
let videoData
const target_title = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0];
const config = { attributes: true, childList: true, subtree: true,timeout:-1 };
const observer2 = new MutationObserver(() =>{
    console.log(document.getElementsByClassName("time-info style-scope ytmusic-player-bar")[0].innerText.toString())
})
const observer = new MutationObserver((mutationList, observer) => {
	let title = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0].title;
	let other = document.getElementsByClassName("subtitle style-scope ytmusic-player-bar")[0].textContent;
	other = other.split('\n')[2]
	other = other.split('          ')[1]
	console.log(other);
	console.log(typeof(other))

	let creater = other.split(' • ')[0]
	let views = other.split(' • ')[1]
	let likes = other.split(' • ')[2]
	console.log(`[YoutubeRPC] Stuff changed ${mutationList} ${observer}`)
	console.log(`[YoutubeRPC] All info ${title} ${creater} ${views} ${likes}`)
	console.log(`====================\n${title}\nBy ${creater}\n${views} ${likes}\n====================`)
	videoData = {
		"title": title,
		"creater": creater,
		"views": views,
		"likes": likes,
		"url": window.location.href,
		"thumbnail": document.getElementsByClassName("image style-scope ytmusic-player-bar")[0].src,
		"services": "ytmusic",
		"time": timeData
	}

	chrome.runtime.sendMessage({type:"videodata",data: videoData }, async(response) => {
		// console.log('[WatchRPC] [Content Script] received: ', response);
	});
});
observer.observe(target_title, config);
// console.log(document.getElementsByClassName("time-info style-scope ytmusic-player-bar")[0].innerText.toString())





setInterval(() => {
	videotime = document.getElementsByClassName("time-info style-scope ytmusic-player-bar")[0].innerText
	let videotime2
	let curruntTime
	let totalTime
	let timeP

	videotime2 = videotime.split(" / ")
	curruntTime = videotime2[0].split(":")
	totalTime = videotime2[1].split(':')
	curruntTime = parseInt(curruntTime[0]) * 60 + parseInt(curruntTime[1])
	totalTime = parseInt(totalTime[0]) * 60 + parseInt(totalTime[1])
	timeP = curruntTime / totalTime * 100
	timeData = {
		"curruntTime": curruntTime,
		"totalTime": totalTime,
		"timeP": timeP,
		"formatedTime": [videotime.split(" / ")[0],videotime.split(" / ")[1]],
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