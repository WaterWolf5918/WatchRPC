


window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    let test = {
        "image": "https://i.imgur.com/hX8zaIm.png",
        "name":"Video Name",
        "creater":"Video Creater"
    }
    refreshINFO(test)
    try{
        chrome.runtime.sendMessage({type:"getVideoData",data:``}, (response) => {
            console.log('[WatchRPC] [popup] received: ', response);
            if (!response){console.log("[WatchRPC] [popup] No Data"); return}
            refreshINFO({
                "image": response.thumbnail,
                "name": response.title,
                "creator": response.creator,
            })
            
        });
    }
    catch(err){
        console.log(err)
    }

});



/**
 * @param {String} url The background image url (https://i.imgur.com/*)
 */
function changeBackground(url){
    document.getElementById('popup-content').style.backgroundImage = `url('${url}')`
}


function refreshINFO(JSON = {
    "image": "",
    "name":"No Name",
    "creator":"No Creator"
}){
    changeBackground(JSON.image)
    document.getElementById("videoName").innerText = JSON.name
    document.getElementById("videoCreator").innerText = JSON.creator

}

