
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
		"time":{
            "curruntTime": 200,
            "totalTime": 100,
        },
        "timePercent": 10.1000000
	}
]
```


## Info JSON object
### a JSON object that should be appended to any Post or Get request 
```JSON
{
"platform": "*open platform *",
"uuid": "36b8f84d-df4e-4d49-b662-bcde71a8764f", 
"browser": "firefox"
}
```


## open platforms
Open platforms are referring to platforms that by the software linking to can and will not leak your personal data.  The only platforms that are allowed are listed below 
| Platforms |
| --------- |
| Youtube   |
| Youtube Music |


