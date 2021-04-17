let puppeteer = require("puppeteer");
let fs = require("fs");
//no of videos
//views
//watch time
//list of videos
//initial page data
//handle -> loader

console.log("Before");
(async function () {

    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            // args: ["--start-maximized",]
        });
        let newPage = await browserInstance.newPage();
        await newPage.goto("https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph");

        let detail = await newPage.evaluate(brconsole);
        let VideoCount = detail[0].split(" ")[0];
        VideoCount = Number(VideoCount);
        console.log(VideoCount);
        console.log(detail[0]);
        console.log(detail[1]);

        let pCurrentVideoCount = await scrollToBottom(newPage, "#meta #video-title");
        while(VideoCount - 50 > pCurrentVideoCount){
            pCurrentVideoCount = await scrollToBottom(newPage, "#meta #video-title");
        }

        let namesArr = await newPage.evaluate(getStats, "#meta #video-title", "span.style-scope.ytd-thumbnail-overlay-time-status-renderer");
        console.table(namesArr);
    }
    catch (err) {
        console.log(err);
    }
})();

function brconsole() {
    let arr = document.querySelectorAll("#stats  .style-scope.ytd-playlist-sidebar-primary-info-renderer")
    let newarr = []
    newarr.push(arr[0].innerText, arr[1].innerText);

    return newarr;
}

function getStats(title, duration) {
    let name = document.querySelectorAll(title);
    let time = document.querySelectorAll(duration);
    let newarr = []
    for (let i = 0; i < name.length; i++){
        if(name[i].innerText && time[i].innerText)
        newarr.push({Name : name[i].innerText, Time: time[i].innerText});
    }
    return newarr;
}

async function scrollToBottom(page, title){
    function getLengthConsoleFn(title){
        window.scrollBy(0, window.innerHeight);
        let titleArr = document.querySelectorAll(title);
        console.log("titlelength", titleArr.length);
        if(titleArr.length == 899)
            console.log(titleArr);
        return titleArr.length;
    }
    return page.evaluate(getLengthConsoleFn, title);
}