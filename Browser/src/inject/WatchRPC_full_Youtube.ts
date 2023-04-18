// /**
// Get video title -> ``document.getElementsByClassName("style-scope ytd-watch-metadata").title.innerText``
// Get video creator -> ``document.getElementById("owner").children[0].children[1].children[0].innerText``
// Get total time -> ``document.getElementsByClassName("ytp-time-duration")[0].innerText``
// Get current time -> ``document.getElementsByClassName("ytp-time-current")[0].innerText``
//  */

// console.log('\n\nIf your reading this WatchRPC for YTmusic has loaded :)\n\n')

// //WIP regex (.*?) • (?<= • )(.*?)(?= • )
// //@ts-expect-error
// let info:VideoMetadata = {
// 	video: {
// 		creator: "",
// 		title: "",
// 		views: "",
// 		likes: "",
// 		thumbnail: "",
// 		url: ""
// 	},
// 	time: {
// 		curruntTime: 0,
// 		totalTime: 0,
// 		timePercent: 0,
// 		formattedTime: ""
// 	},
// 	extra: {
// 		uuid: crypto.randomUUID(),
// 		service: "ytmusic"
// 	}
// }
// interface VideoMetadata {
//     video: {
//         creator: string;
//         title: string;
//         views?: string;
//         likes?: string;
//         thumbnail: string;
//         url: string;
//     }
//     time: {
//         curruntTime: number;
//         totalTime: number;
//         timePercent: number;
//         formattedTime: string;
//     }
//     extra: {
//         uuid: string,
// 		service: string
//     }
// }

// //@ts-ignore
// let target_title2 = document.getElementsByClassName("style-scope ytd-watch-metadata")[0]
// const config2 = { attributes: true, childList: true, subtree: true,timeout:-1 };
// const titleWatcher = new MutationObserver((mutationList, observer) => {
//     let selfID = self.location.href.split('=')[1]
//     //@ts-ignore
//     let title = document.getElementsByClassName("style-scope ytd-watch-metadata").title.innerText
//     //@ts-ignore
//     let creator = document.getElementById("owner").children[0].children[1].children[0].innerText
//     //@ts-ignore
//     let views = document.getElementById('info-container').children[0].children[0].innerText
//     //@ts-ignore
//     let likes = document.getElementById("segmented-like-button").children[0].children[0].children[0].children[1].innerText
//     info.video = {
// 		"title":title,
// 		"creator":creator,
// 		"views": views,
// 		"likes": likes,
// 		"url": window.location.href,
// 		"thumbnail": `https://i.ytimg.com/vi/${selfID}/maxresdefault.jpg`
// 	}
//     console.log(info.video)
// })

// const timeWatcher = new MutationObserver((mutationList, observer) => {
//     //time updated will happen here
//     console.log("update")
// })

// window.onload = (event) => {
//     loadObserve()
// };

// function loadObserve(){
//     console.log(document.getElementsByClassName("style-scope ytd-watch-metadata")[0])
//     if (document.getElementsByClassName("style-scope ytd-watch-metadata")[1] == undefined){
//         console.warn('[WatchRPC] Title has not loaded into the DOM yet retrying in 2 secs')
//         setTimeout(()=>{
//             loadObserve()
//         },2000)
//     }else{
//         timeWatcher.observe(document.getElementsByClassName("ytp-time-current")[0],{ attributes: true, childList: true, subtree: true})
//         titleWatcher.observe(document.getElementsByClassName("style-scope ytd-watch-metadata")[1],{ attributes: true, childList: true, subtree: true})
//     }
// }
