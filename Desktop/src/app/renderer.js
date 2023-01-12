function changeTheme(cssFile,name){
	var head = document.getElementsByTagName("head")[0]
	var link = document.createElement("link")
	link.id = name
	link.rel = "stylesheet"
	link.type = "text/css"
	link.href = cssFile
	head.appendChild(link)
}

function button(text) {
	switch (text) {
		case "index":
			console.log('t')
			location.href = "index.html";
			break;
		case "settings":
			location.href = "settings.html";
			break;
	}
}

changeTheme("./themes/neonDark.css","neonDark")

document.getElementById('close_button').addEventListener('click', (event) => {
	console.log(event)
	console.log(`Current Service: ${document.getElementById("services").value}`)
	console.log(`showTTY: ${document.getElementById("TTY").checked}`)
	console.log(`useVideoThumbnails: ${document.getElementById("uVT").checked}`)
	window.settings.status({
		"showTTy": document.getElementById("TTY").checked,
		"useVideo":document.getElementById("uVT").checked,
		"Service": `${document.getElementById("services").value}`
	})
	window.controls.close();
})

windowAction = {
    minimize: () => {
        window.controls.minimize();
    },
    close: () => {
        window.controls.close();
    },
}









