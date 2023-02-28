console.log('[WatchRPC] Loaded Background Script')
//@ts-expect-error


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
        uuid: '',
        service: "ytmusic"
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
        uuid: string, 
		service: string
    }
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.type){
        case "UUID":
            info.extra.uuid = message.data
            break
        case "unload":
            sendUnload(message.data.service,message.uuid)
        case "videodata":
            console.log(`[WatchRPC] [Background]: ${JSON.stringify(message.data)}`);
            console.log(message.data)
            info.video = message.data
            sendFetch(info.video,message.uuid)
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
            sendTime(info.time,message.uuid)
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

// fetch(`http://localhost:9494/open/${info.extra.uuid}/${info.extra.service}`, {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({})
// })

function sendUnload(service: string,uuid: string){
    fetch(`http://localhost:9494/close/${uuid}/ytmusic`, {
    	method: 'POST',
    	headers: {
    	    'Accept': 'application/json',
    	    'Content-Type': 'application/json'
    	},
    	body: JSON.stringify({})
	})
}

/** 
 * @param {Object} info The json object that contains the video info [browser only] (Doesn't use the protocol) 
*/
function sendFetch(videoData: any,uuid: string){
	fetch(`http://localhost:9494/data/ytmusic/${uuid}`, {
    	method: 'POST',
    	headers: {
    	    'Accept': 'application/json',
    	    'Content-Type': 'application/json'
    	},
    	body: JSON.stringify(videoData)
	})
}


async function sendTime(timeData: any, uuid: string){
    console.log(timeData)
    fetch(`http://localhost:9494/time/ytmusic/${uuid}`, {
    	method: 'POST',
    	headers: {
    	    'Accept': 'application/json',
    	    'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
    	},
    	body: JSON.stringify(timeData)
	})
    // .then(response=>{
    //     return response.json()
    // })
    // .then(data=>{
    //     if (data.error){
    //         console.groupCollapsed(`Error: ${data.error.code}`)
    //         console.log(`Error Code: ${data.error.code}`)
    //         console.log(`What: ${data.error.what}`)
    //         console.groupEnd() 
    //         // if (data.error.code == 1 || 2){
    //         //     chrome.tabs.query({},(tabs)=>{
    //         //         tabs.forEach(element => {
    //         //             if(element.title.includes("YouTube Music")){
    //         //                 chrome.tabs.sendMessage(element.id, {"type":"getVideoData","message":null}, (response) => {
    //         //                     console.log(response)
    //         //                     info.video = response
    //         //                     sendFetch(info.video)
    //         //                 });
    //         //             }
    //         //         });
    //         //     });
    //         // }
    //     }
    // })
}