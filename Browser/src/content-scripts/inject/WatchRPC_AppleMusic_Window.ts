// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
setInterval(() => {
    const data = {
        currentPlaybackProgress: window.audioPlayer.currentPlaybackProgress,
        currentPlaybackTimeRemaining: window.audioPlayer.currentPlaybackTimeRemaining,
        currentPlaybackTime: window.audioPlayer.currentPlaybackTime,
        currentPlaybackDuration: window.audioPlayer.currentPlaybackDuration,
        event:'audioPlayerTime'
    };
    window.postMessage({ from: 'WatchRPC_AppleMusic_Window',data: data });
},5000);
////@ts-expect-error "Duplicate function implementation." Typescript this is a diffrent file 