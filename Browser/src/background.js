console.log('[WatchRPC] Loaded Background Script')
let videoData
let timeData


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.type){
        case "videodata":
            console.log(`[WatchRPC] [Background]: ${JSON.stringify(message.data)}`);
            videoData = message.data;
            sendResponse("OK");
            sendFetch(videoData);
            break;
        case "getVideoData":
            console.log(`[WatchRPC] [Background]: Sending Video Data`)
            if (!videoData){
                sendResponse(false);
                return;
            }
            sendResponse(videoData);
            break;
        case "timedata":
            timeData = message.data
            sendResponse("OK");
            sendTime(timeData)
            break;
        case "getTimeData":
            console.log(`[WatchRPC] [Background]: Sending Time Data`)
            if (!timeData){
                sendResponse(false);
                return;
            }
            sendResponse(timeData);
            break;
    }
});





/** 
 * @param {Object} info The json object that contains the video info [browser only] (Doesn't use the protocol) 
*/
function sendFetch(videoData){
	fetch("http://localhost:9494/YTmusic", {
    	method: 'POST',
    	headers: {
    	    'Accept': 'application/json',
    	    'Content-Type': 'application/json'
    	},
    	body: JSON.stringify(videoData)
	})
}


async function sendTime(timeData){
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
                                videoData = response
                                sendFetch(videoData)
                            });
                        }
                    });
                });
            }
        }
    })
}