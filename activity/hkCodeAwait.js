let puppeteer = require("puppeteer");
let fs = require("fs");
let { password, email } = require("../secrets");
let { codes } = require("./code");

(async function () {
    try{
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            // args: ["--start-maximized",]
        });
        let newTab = await browserInstance.newPage();
        await newTab.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
        await newTab.type("#input-1", email, { delay: 200 });
        await newTab.type("#input-2", password, { delay: 200 });
        await newTab.click("button[data-analytics='LoginPassword']");
        await waitAndClick(".card-content h3[title='Interview Preparation Kit']", newTab);
        await waitAndClick("a[data-attr1='warmup']", newTab);
        let url = newTab.url();
    
        let questionObj = codes[0];
        for (let i = 0; i < codes.length; i++) {
            await questionSolver(url, codes[i].soln, codes[i].qName, newTab);
        }
    }catch(err){
        console.log(" Lo mai aya");
    }
})();


async function waitAndClick(selector, newTab) {
    await newTab.waitForSelector(selector, { visible: true });
    //here we will not add await because it will resolve the promise and 
    // we want that the person who called this function should wait for the promise therefore we will return pending promise
    let SelectorPromise = newTab.click(selector);
    return SelectorPromise;
}

async function questionSolver(modulepageUrl, code, questionName, newTab) {
    await newTab.goto(modulepageUrl);
    function browserconsolerunFn(questionName) {
        let allH4Elem = document.querySelectorAll("h4");
        let textArr = [];
        for (let i = 0; i < allH4Elem.length; i++) {
            let myQuestion = allH4Elem[i].innerText.split("\n")[0];
            textArr.push(myQuestion);
        }
        let idx = textArr.indexOf(questionName);
        // console.log(idx);
        // console.log("hello");
        allH4Elem[idx].click();
    }

    await newTab.evaluate(browserconsolerunFn, questionName);
    await waitAndClick(".custom-checkbox.inline", newTab);
    await newTab.type(".custominput", code);
    await newTab.keyboard.down("Control");
    await newTab.keyboard.press("A");
    await newTab.keyboard.press("X");
    await newTab.click(".monaco-editor.no-user-select.vs")
    await newTab.keyboard.press("A");
    await newTab.keyboard.press("V");
    await newTab.keyboard.up("Control");

    return newTab.click(".pull-right.btn.btn-primary.hr-monaco-submit");
}