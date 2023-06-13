//This is a WARNING do not change the id of theme ether element. It makes no sense why but both elements have to be the same id or it breaks.
// const store = window.localStorage;

async function getTheme(){
    return await window.theme.getTheme();

}

async function selectCSSFile() {
    let cssFile = await getTheme();
    const head = document.getElementsByTagName("head")[0];
    const theme = document.getElementById("theme") as HTMLLinkElement;
    console.log(`./themes/${cssFile}.css`);
    theme.href = `./themes/${cssFile}.css`;
};

function loadThemeByName(theme) {
    window.theme.setTheme(theme);
    selectCSSFile();
};


async function loadDefTheme() {
    const item = await getTheme();
    console.log(item);
    if (item == null) {
        console.log("No theme detected using default");
        window.theme.setTheme("neonDark");
        selectCSSFile();
        return;
    };
    selectCSSFile();
};

function clearDefTheme() {
    window.theme.setTheme("neonDark")
    selectCSSFile();
};

document.getElementById("theme").addEventListener("change", (event) => {
    loadThemeByName((document.getElementById("theme") as HTMLSelectElement).value );
    window.settings.forceRefresh();
});

loadDefTheme();
