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




function sendTime(timeData){
    console.log(timeData)
    fetch("http://localhost:9494/time", {
    	method: 'POST',
    	headers: {
    	    'Accept': 'application/json',
    	    'Content-Type': 'application/json'
    	},
    	body: JSON.stringify(timeData)
	})
}










  