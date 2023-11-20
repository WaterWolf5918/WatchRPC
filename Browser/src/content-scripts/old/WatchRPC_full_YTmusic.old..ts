// import { config } from 'src/common';
// console.log('\n\nIf your reading this WatchRPC for YTmusic has loaded :)\n\n');

// //WIP regex (.*?) • (?<= • )(.*?)(?= • )
// const info: VideoMetadata = {
//     video: {
//         creator: '',
//         title: '',
//         views: '',
//         likes: '',
//         thumbnail: '',
//         url: '',
//     },
//     time: {
//         curruntTime: 0,
//         totalTime: 0,
//         timePercent: 0,
//         formattedTime: '',
//     },
//     extra: {
//         uuid: crypto.randomUUID(),
//         service: 'ytmusic',
//     },
// };


// const target_title = document.getElementsByClassName(
//     'title style-scope ytmusic-player-bar',
// )[0];


// const observer = new MutationObserver((mutationList, observer) => {
//     const title = (<HTMLParagraphElement>document.getElementsByClassName('title style-scope ytmusic-player-bar',)[0]).title;
//     let other = document.getElementsByClassName(
//         'subtitle style-scope ytmusic-player-bar',
//     )[0].textContent;
//     other = other.split('\n')[2];
//     other = other.split('          ')[1];
//     console.log(other);
//     console.log(typeof other);

//     const creator = other.split(' • ')[0];
//     const views = other.split(' • ')[1];
//     const likes = other.split(' • ')[2];
//     console.log(`[YoutubeRPC] Stuff changed ${mutationList} ${observer}`);
//     console.log(`[YoutubeRPC] All info ${title} ${creator} ${views} ${likes}`);
//     console.log(
//         `====================\n${title}\nBy ${creator}\n${views} ${likes}\n====================`,
//     );
//     info.video = {
//         title: title,
//         creator: creator,
//         views: views,
//         likes: likes,
//         url: window.location.href,
//         thumbnail: (<HTMLImageElement>document.getElementsByClassName('image style-scope ytmusic-player-bar',)[0]).src,
//     };
//     chrome.runtime.sendMessage(
//         {
//             type: 'videodata',
//             fetch: {
//                 url:`http://localhost:9494/time/${info.extra.uuid}/${info.extra.service}`,
//                 methed: 'POST',
//                 body: JSON.stringify(info.time)
//             }
//         },
//         async (_response) => {
//             // console.log('[WatchRPC] [Content Script] received: ', response);
//         },
//     );
// });
// observer.observe(target_title, config);

// const timer = setInterval(() => {

//     // curruntTime = parseInt(curruntTime[0]) * 60 + parseInt(curruntTime[1]);
//     // totalTime = parseInt(totalTime[0]) * 60 + parseInt(totalTime[1]);
//     // timeP = (curruntTime / totalTime) * 100;
//     // info.time = {
//     //     curruntTime: curruntTime,
//     //     totalTime: totalTime,
//     //     timePercent: timeP,
// eslint-disable-next-line no-irregular-whitespace
//     //     formattedTime: `${globalThis.videotime.split(' / ')[0]} / ${
//     //         globalThis.videotime.split(' / ')[1]
//     //     }`,
//     // };
//     // console.log(globalThis.videotime.split(' / '));

//     chrome.runtime.sendMessage(
//         {
//             type: 'timedata',
//             data: info.time,
//             uuid: info.extra.uuid,
//             service: info.extra.service,
//         },
//         async (response) => {
//             console.log('[WatchRPC] [Content Script] received: ', response);
//         },
//     );
// }, 1000);

// chrome.runtime.onMessage.addListener((mail, sender, send) => {
//     console.log(mail);
//     switch (mail.type) {
//     case 'getVideoData':
//         send(info);
//         break;
//     default:
//         send('malformed data');
//     }
// });

// window.addEventListener('unload', (_e) => {
//     clearInterval(timer);
//     observer.disconnect();
//     chrome.runtime.sendMessage(
//         { type: 'unload', data: { service: 'ytmusic' }, uuid: info.extra.uuid },
//         async (response) => {
//             console.log('[WatchRPC] [Content Script] received: ', response);
//         },
//     );
// });
// export {}; //We don't need to export anything, this just makes typescript happy :).