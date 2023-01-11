
# Video Data
A JSON object with 2 arrays the first array being for the video info [1], and the second array being for the time info[2]

[1]:
```json
	{
		"creater": "(The video creater)",
        "title": "(The name of the video)",
        "thumbnail": "(The video thumbnail, if there is one)",
        "extra":{
            "url": "(The url of the video on open platforms)"
        }
	},
```

[2]:
```json
	{
		"time":{
            "curruntTime": 200,
            "totalTime": 100,
        },
        "timepercent": 10.1000000
	}
```

## The complete JSON object
```json
[
	{
		"creater": "(The video creater)",
        "title": "(The name of the video)",
        "thumbnail": "(The video thumbnail, if there is one)",
        "extra":{
            "url": "(The url of the video on open platforms)",
            "views": "",
            "likes": ""
        }
	},
	{
		"curruntTime": 100,
		"totalTime:": 200,
		"formatedTime": ["0","0"],
        "timePercent": 10.1000000
	}
]
```



# Post Response JSON
```json
{
    "request": "(The Request That Was Made)",
    "error" {       // is null is there is no error
        "code": 1, 
        "what": "VideoData is missing" 
    }
}
```


## Post Response Error Codes
| Code | Error| 
| --------- | ------- |
| 0 | reserved | 
| 1 | VideoData is missing |
| 2 | VideoData call failed | 
| 3 | reserved | 



## open platforms
Open platforms are referring to platforms that by the software linking to can and will not leak your personal data.  The only platforms that are allowed are listed below 
| Platforms |
| --------- |
| Youtube   |
| Youtube Music |


