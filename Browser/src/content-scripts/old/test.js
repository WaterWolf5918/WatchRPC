/* eslint-disable @typescript-eslint/no-unused-vars */
const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
    timeout: -1,
};
const target_title = document.getElementsByClassName(
    'title style-scope ytmusic-player-bar',
)[0];

let time = 0;

function secondsToFormat(seconds){
    const m = Math.round(Math.floor(seconds / 60));
    let s = Math.round(seconds - m * 60);
    if (s < 10){s = `0${s}`;}
    return [m,s];
}

document.querySelector('video').addEventListener('timeupdate', (_e) => {
    const _cTime = _e.target.currentTime;
    const _tTime = _e.target.duration;
    if (time == 0){ time = Math.round(_cTime);}
    if (Math.round(_cTime) == Math.round(time)){return;}
    else{
        const fct = secondsToFormat(_cTime); //formated current time
        const ftt = secondsToFormat(_tTime); //formated total time
        console.log(`${fct[0]}:${fct[1]} / ${ftt[0]}:${ftt[1]}`);

        time = _cTime;
    }
});

const observer = new MutationObserver((_mutationList, _observer) => {
    const title = document.getElementsByClassName('title style-scope ytmusic-player-bar',)[0].title;
    const subInfo = document.getElementsByClassName('byline style-scope ytmusic-player-bar complex-string')[0];
    const creator = subInfo.querySelector('a').innerText;
    console.log(
        `====================\n${title}\nBy ${creator}\n====================`,
    );

});
observer.observe(target_title, config);