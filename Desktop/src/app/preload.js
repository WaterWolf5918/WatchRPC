const { contextBridge, ipcRenderer } = require("electron")


contextBridge.exposeInMainWorld("controls", {
    minimize: () => ipcRenderer.invoke("winControls", "minimize"),
    max: () => ipcRenderer.invoke("winControls", "max"),
    close: () => ipcRenderer.invoke("winControls", "close"),
    size: (arg) => ipcRenderer.invoke("size", arg),
})


contextBridge.exposeInMainWorld("settings", {
    settings: () => ipcRenderer.invoke("settings", "settings"),
    status: (arg) => ipcRenderer.invoke("status", arg),
    getStatus: () => ipcRenderer.invoke("getStatus")
})


// ipcRenderer.on("getstatus",(event,data) => {
//     console.log(data)
//         window.onload( () =>{
//             document.getElementById("services").value = "test"
//             document.getElementById("TTY").checked = Boolean(data.showTTY)
//             document.getElementById("TTY").checked = Boolean(data.showTTY)
//     })


//     console.log(`Current Service: ${document.getElementById("services").value}`)
// 	console.log(`showTTY: ${document.getElementById("TTY").checked}`)
// 	console.log(`useVideoThumbnails: ${document.getElementById("uVT").checked}`)
// })


ipcRenderer.on("infoUpdate",(event,data) => {
    console.log(data)
    if (location.href.includes("index.html")) {
        updateInfo(data)
    }
})


/** 
 * @param {Object} info The json object that contains the video info [read protocol.md]
*/

function updateInfo(info){
    let thumbnail = info[0].thumbnail
    let title = info[0].title
    let creater = info[0].creater

    let curruntTime = info[1].formatedTime[0]
    let totalTime = info[1].formatedTime[1]
    let timePercent = info[1].timePercent
    updateTitle(title,creater)
    updateImage(thumbnail)

    updateProgressBar(curruntTime,totalTime,timePercent)
}



/**
 * 
 * @param {String} image - The image to be used, only pass in the url
 */

function updateImage(image){
    let imageDOM = document.getElementById("video_image")
    //check if should use image
    if (image == "ytlogo4"){
        imageDOM.style.height = "35vw";
        imageDOM.style.width = "35vw";
        imageDOM.style.left = "2%";
        imageDOM.style.backgroundImage = `url(../YTlogo4.png)`;
    }else{
        imageDOM.style.height = "35vw";
        imageDOM.style.width = "35vw";
        imageDOM.style.left = "1%";
        imageDOM.style.backgroundImage = `url(${image})`;
    }
}


/**
 * 
 * @param {String} title - The title of the video
 * @param {String} creater - The Creater of the video
 */

function updateTitle(title,creater){
    let titleDOM = document.getElementById("video_name")
    let createrDOM = document.getElementById("video_creater")
    titleDOM.innerText = title;
    createrDOM.innerText = creater;
}



/**
 * 
 * @param {Number} curruntTime 
 * @param {Number} totalTime 
 * @param {Number} timePercent 
 */


//  document.getElementById("TimeBar")
//  .style.width = data[1].timePercent + "%";
//  console.log(data[1].time)
//  document.getElementById("Time")
//  .innerText = `${data[1].time.formatedTime[0]} / ${data[1].time.formatedTime[1]}`


function updateProgressBar(curruntTime,totalTime,timePercent){
    let ProgressBar = document.getElementById("time_bar");
    let ProgressText = document.getElementById("time");
    let FormatedText = `${curruntTime} / ${totalTime}`
    ProgressBar.style.width = `${timePercent}%`
    ProgressText.innerText = FormatedText
}


