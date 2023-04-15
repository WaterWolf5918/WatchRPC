// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
const themeLookup = {
	"neondark":"neonDark",
	"neonlight":"neonLight",
	"flatdark":"flatDark",
	"flatlight":"flatLight",
	"acrylic": "winAcrylic"
}
const store = window.localStorage



function changeTheme(cssFile){
	const head = document.getElementsByTagName("head")[0]
	const theme = document.getElementById("theme")
	theme.href = cssFile
}


function loadDefTheme(){
	const item = window.localStorage.getItem("theme")
	console.log(item)	
	if (item == null){
		console.log("No theme detected using default")
		store.setItem("theme","neondark")
        changeTheme(`./themes/${themeLookup[store.getItem("theme")]}.css`)
		return
	}
	changeTheme(`./themes/${themeLookup[store.getItem("theme")]}.css`)
}


function loadTheme(theme){
	store.setItem("theme",theme)
	changeTheme(`./themes/${themeLookup[store.getItem("theme")]}.css`)
}


function clearDefTheme(){
	store.setItem("theme","neondark")
	changeTheme(`./themes/${themeLookup[store.getItem("theme")]}.css`,store.getItem("theme"))
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
loadDefTheme()
// changeTheme("./themes/neonDark.css","flatDark")

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
	loadTheme(document.getElementById("theme").value)
	window.settings.forceRefresh()
})


document.getElementById('theme').addEventListener('change', (event) => {
	loadTheme(document.getElementById("theme").value)
	console.log(typeof("tjibdks"))
	window.settings.forceRefresh()
})





windowAction = {
    minimize: () => {
        window.controls.minimize();
    },
    close: () => {
        window.controls.close();
    },
}









