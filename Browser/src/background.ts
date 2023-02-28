console.log('[WatchRPC] Loaded Background Script')
let info: VideoMetadata = {
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
        platform: "",
        uuid: "",
        browser: ""
    }
}

interface VideoMetadata {
    video: {
        creator: string;
        title: string;
        views?: string;
        likes?: string;
        thumbnail: string;
        url: string;
    }
    time: {
        curruntTime: number;
        totalTime: number;
        timePercent: number;
        formattedTime: string;
    }
    extra: {
        platform: string,
        uuid: string, 
        browser: string
    }
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.type){
        case "videodata":
            console.log(`[WatchRPC] [Background]: ${JSON.stringify(message.data)}`);
            console.log(message.data)
            info.video = message.data
            break;
        case "getVideoData":
            console.log(`[WatchRPC] [Background]: Sending Video Data`)
            if (!info.video){
                sendResponse(false);
                return;
            }
            sendResponse(info.video);
            break;
        case "timedata":
            info.time = message.data
            sendResponse("OK");
            sendTime(info.time)
            break;
        case "getTimeData":
            console.log(`[WatchRPC] [Background]: Sending Time Data`)
            if (!info.time){
                sendResponse(false);
                return;
            }
            sendResponse(info.time);
            break;
    }
});





/** 
 * @param {Object} info The json object that contains the video info [browser only] (Doesn't use the protocol) 
*/
function sendFetch(videoData: any){
	fetch("http://localhost:9494/YTmusic", {
    	method: 'POST',
    	headers: {
    	    'Accept': 'application/json',
    	    'Content-Type': 'application/json'
    	},
    	body: JSON.stringify(videoData)
	})
}


async function sendTime(timeData: any){
    // console.log(timeData)
    fetch("http://localhost:9494/time", {
    	method: 'POST',
    	headers: {
    	    'Accept': 'application/json',
    	    'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
    	},
    	body: JSON.stringify(timeData)
	})
    .then(response=>{
        return response.json()
    })
    .then(data=>{
        if (data.error){
            console.groupCollapsed(`Error: ${data.error.code}`)
            console.log(`Error Code: ${data.error.code}`)
            console.log(`What: ${data.error.what}`)
            console.groupEnd() 
            if (data.error.code == 1 || 2){
                chrome.tabs.query({},(tabs)=>{
                    tabs.forEach(element => {
                        if(element.title.includes("YouTube Music")){
                            chrome.tabs.sendMessage(element.id, {"type":"getVideoData","message":null}, (response) => {
                                console.log(response)
                                info.video = response
                                sendFetch(info.video)
                            });
                        }
                    });
                });
            }
        }
    })
}