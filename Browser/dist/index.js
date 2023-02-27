window.addEventListener('load', function (event) {
    console.log('page is fully loaded');
    var test = {
        "image": "https://i.imgur.com/hX8zaIm.png",
        "name": "Video Name",
        "creater": "Video Creater"
    };
    refreshINFO(test);
    try {
        chrome.runtime.sendMessage({ type: "getVideoData", data: "" }, function (response) {
            console.log('[WatchRPC] [popup] received: ', response);
            if (!response) {
                console.log("[WatchRPC] [popup] No Data");
                return;
            }
            refreshINFO({
                "image": response.thumbnail,
                "name": response.title,
                "creater": response.creater
            });
        });
    }
    catch (err) {
        console.log(err);
    }
});
/**
 * @param {String} url The background image url (https://i.imgur.com/*)
 */
function changeBackground(url) {
    document.getElementById('popup-content').style.backgroundImage = "url('".concat(url, "')");
}
function refreshINFO(JSON) {
    if (JSON === void 0) { JSON = {
        "image": "",
        "name": "No Name",
        "creater": "No Creater"
    }; }
    changeBackground(JSON.image);
    document.getElementById("videoName").innerText = JSON.name;
    document.getElementById("videoCreater").innerText = JSON.creater;
}
