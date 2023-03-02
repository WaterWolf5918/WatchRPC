/* eslint-disable no-irregular-whitespace */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { contextBridge, ipcRenderer } from "electron"
import { VideoMetadata } from "./utils"

contextBridge.exposeInMainWorld("controls", {
  minimize: () => ipcRenderer.invoke("winControls", "minimize"),
  maximize: () => ipcRenderer.invoke("winControls", "maximize"),
  close: () => ipcRenderer.invoke("winControls", "close"),
  size: (arg) => ipcRenderer.invoke("size", arg),
})


contextBridge.exposeInMainWorld("settings", {
  settings: () => ipcRenderer.invoke("settings", "settings"),
  status: (arg) => ipcRenderer.invoke("setOptions", arg),
  getStatus: () => ipcRenderer.invoke("getOptions"),
  forceRefresh: () => ipcRenderer.invoke("forceRefresh")
})

ipcRenderer.on("infoUpdate", (event, data) => {
  console.log(data)
  if (location.href.includes("index.html")) {
    updateInfo(data)
  }
})

/** 
 * @param {Object} info The json object that contains the video info [read protocol.md]
*/
function updateInfo(info: VideoMetadata) {
  const thumbnail = info.video.thumbnail
  const title = info.video.title
  const creater = info.video.creator
  const formattedTime = info.time.formattedTime
  const timePercent = info.time.timePercent
  updateTitle(title, creater)
  updateImage(thumbnail)

  updateProgressBar(formattedTime, timePercent)
}




function updateImage(image) {
  const imageDOM = document.getElementById("video_image")
  console.log(image)
  //check if should use image
  if (image == "ytlogo") {
    imageDOM.style.height = "35vw";
    imageDOM.style.width = "35vw";
    imageDOM.style.left = "2%";
    imageDOM.style.backgroundImage = `url(../app/YTlogo4.png)`;
  } else {
    imageDOM.style.height = "35vw";
    imageDOM.style.width = "35vw";
    imageDOM.style.left = "1%";
    imageDOM.style.backgroundImage = `url(${image})`;
  }
}



function updateTitle(title: string, creater: string) {
  const titleDOM = document.getElementById("video_name")
  const createrDOM = document.getElementById("video_creater")
  titleDOM.innerText = title;
  createrDOM.innerText = creater;
}


function updateProgressBar(formattedTime: string, timePercent: number) {
  const ProgressBar = document.getElementById("time_bar");
  const ProgressText = document.getElementById("time");
  ProgressBar.style.width = `${timePercent}%`
  ProgressText.innerText = formattedTime.toString()
}


