/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

//@ts-ignore | This is added to some function and var because typescript thinks all the files are part of a block or global scope when infact there loaded into diffrent browser windows.
// This is needed because it does change just not in this file. This is inside the window scope and a diffrent injected script changes it.
// eslint-disable-next-line prefer-const 
let time = 0;


//@ts-ignore | This is added to some function and var because typescript thinks all the files are part of a block or global scope when infact there loaded into diffrent browser windows.
const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
    timeout: -1,
};


interface VideoMetadata {
    video: {
        creator: string;
        title: string;
        views?: string;
        likes?: string;
        thumbnail: string;
        url: string;
    };
    time: {
        curruntTime: number;
        totalTime: number;
        timePercent: number;
        formattedTime: string;
    };
    extra: {
        uuid: string;
        service: string;
    };
}


const info: VideoMetadata = {
    video: {
        creator: '',
        title: '',
        views: '',
        likes: '',
        thumbnail: '',
        url: '',
    },
    time: {
        curruntTime: 0,
        totalTime: 0,
        timePercent: 0,
        formattedTime: '',
    },
    extra: {
        uuid: crypto.randomUUID(),
        service: '',
    },
};

//@ts-ignore | This is added to some function and var because typescript thinks all the files are part of a block or global scope when infact there loaded into diffrent browser windows.
function secondsToFormat(seconds){
    const m = Math.round(Math.floor(seconds / 60));
    let s: string | number = Math.round(seconds - m * 60);
    if (s < 10){s = `0${s}`;}
    console.log('common');
    return [m,s];
}

function clientSendVideo(){
    //Try to get video data into info even if mutationobserver is not working
    scriptGetVideo();
    chrome.runtime.sendMessage(
        {
            type: 'exportFetch',
            fetch: {
                url:`http://localhost:9494/data/${info.extra.uuid}/${info.extra.service}`,
                method: 'POST',
                body: JSON.stringify(info.video)
            }
        },
        async (_response) => {
            if(_response.error){
                switch(_response.error.code){
                    default:
                        console.error(_response.error);
                        break;
                }
            }
        },
    );
}

function clientSendTime(){
    chrome.runtime.sendMessage(
        {
            type: 'exportFetch',
            fetch: {
                url:`http://localhost:9494/time/${info.extra.uuid}/${info.extra.service}`,
                method: 'POST',
                body: JSON.stringify(info.time)
            }
        },
        async (_response) => {
            if(_response.error){          
                switch(_response.error.code){
                    default:
                        console.error(_response.error);
                        break;

                    case 2:
                        console.error('missing video data');
                        clientSendVideo();
                }
            }
        },
    );
}


function awaitElementLoad(element,callback){
    addEventListener('DOMContentLoaded', (event) => {
        console.log(event);
        const contentLoadedTimer = setInterval(() => {
            if(typeof(element()) !== 'object'){
                console.log('element is not loaded');
                //element doesn't exist yet, wait a second and hope for the best
            }else{
                clearInterval(contentLoadedTimer);
                console.log('element loaded');
                callback();
                return true;
            }
        },1000);
    });
}