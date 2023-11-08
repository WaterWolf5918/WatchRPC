export { };

declare global {
    interface Window {
        theme: {
            setTheme: any
            getTheme: any
        },
        settings: any
    }

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
            platform: string;
            uuid: string;
            browser: string;
        };
    }
    
    enum WinControls {
        minimize,
        maximize,
        close,
    }

}
