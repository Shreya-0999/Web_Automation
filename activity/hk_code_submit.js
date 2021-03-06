let puppeteer = require("puppeteer");
let { password, email } = require("../secrets")
let { codes } = require("./code");
let gtab = "";

console.log("before");

let browserPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null    // to occupy the full screen
})

browserPromise.then(function (browserInstance) {
    let newtabPromise = browserInstance.newPage();
    return newtabPromise
}).then(function (newTab) {
    let loginPageWillBeopenedPromise = newTab.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
    gtab = newTab;
    return loginPageWillBeopenedPromise;
}).then(function () {
    let emailWillBeTypedPromise = gtab.type("#input-1", email, { delay: 200 })
    return emailWillBeTypedPromise;
}).then(function () {
    let passwordwillbetyped = gtab.type("#input-2", password, { delay: 200 })
    return passwordwillbetyped;
})
    // .then(function () {
    //     let loginPageWillBeClickedpromise = gtab.click("button[data-analytics='LoginPassword']");
    //     return loginPageWillBeClickedpromise;
    // })
    .then(function () {
        let loginPageWillBeClickedPromise = gtab.click("button[data-analytics='LoginPassword']");
        let IPKit = gtab.waitForSelector(".card-content h3[title= 'Interview Preparation Kit']", { visible: true }); // a promise to check whether the page containing this card has been loaded or not
        // url phele aajata hai or content baad m ata h to dono k liye wait krna pdega 
        let combinedPromise = Promise.all([loginPageWillBeClickedPromise, gtab.waitForNavigation({ waitUntil: "networkidle0" }), IPKit]); // three promises are been done here 1. click promise 2. respond from server 3. next page loaded
        return combinedPromise;
    })
    .then(function () {
        let clickIPkit = waitAndClick(".card-content h3[title='Interview Preparation Kit']");
        // console.log("hello");
        return clickIPkit;
    })
    .then(function () {
        // console.log("3 hello");
        let clickwarmupPromise = waitAndClick("a[data-attr1='warmup']");
        return clickwarmupPromise;
    }).then(function () {
        return gtab.url();
    }).then(function (url) {
        console.log(url);
        let questionObj = codes[0];
        let fqsp = questionSolver(url, questionObj.soln, questionObj.qName);
        for(let i = 1; i < codes.length; i++){
            fqsp = fqsp.then(function(){
                return questionSolver(url, codes[i].soln, codes[i].qName);
            })
        }
    }).catch(function (err) {
        console.log(err);
    })
console.log("After");

function waitAndClick(selector) {
    return new Promise(function (resolve, reject) {

        let selectorWaitPromise = gtab.waitForSelector(selector, { visible: true });
        // console.log("1 hello");
        selectorWaitPromise.then(function () {
            // console.log("2 hello");
            let selectorClickPromise = gtab.click(selector);
            return selectorClickPromise;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        }) 
    })
}

function questionSolver(modulepageUrl, code, questionName) {
    return new Promise(function (resolve, reject) {
        //page visit 
        let reachedPageUrlPromise = gtab.goto(modulepageUrl); // first wale ko chod k bakiyo k liyye lagaya h first wale k liye dobara chalega 
        reachedPageUrlPromise.then(function () {
            // page h4 -> matching h4 -> click
            //function will execute inside the browser
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

            let pageClickPromise = gtab.evaluate(browserconsolerunFn, questionName); // the function called here will be called on the browser document i.e ye wala function yha console pr nhi chlega jo browser ka console h wha chalega
            return pageClickPromise;
        })
        .then(function(){
            let inputclickedPromise = waitAndClick(".custom-checkbox.inline");
            return inputclickedPromise;
        })
        .then(function(){
            let inputboxclickedPromise = gtab.type(".custominput", code);
            return inputboxclickedPromise;
        })
        .then(function(){
            let controlPressedPromise = gtab.keyboard.down("Control");
            return controlPressedPromise;
        })
        .then(function(){
            //cntrl a
            let aisPressedPromise = gtab.keyboard.press("A");
            return aisPressedPromise;
        })
        .then(function(){
            //cntrl x
            let xisPressedPromise = gtab.keyboard.press("X");
            return xisPressedPromise;
        })
        .then(function(){
            let textAreaisClicked = gtab.click(".monaco-editor.no-user-select.vs")
            return textAreaisClicked;
        })
        .then(function(){
            //cntrl a
            let aisPressedPromise = gtab.keyboard.press("A");
            return aisPressedPromise;
        })
        .then(function(){
            //cntrl v
            let visPressedPromise = gtab.keyboard.press("V");
            return visPressedPromise;
        })
        .then(function(){
            let submitButtonClickedPromised = gtab.click(".pull-right.btn.btn-primary.hr-monaco-submit");
            return submitButtonClickedPromised;
        })
        .then(function () {                                                    
            resolve();
        })
        .catch(function(err){
            console.log(err);
        })
        // questionName-> appear -> click
        // read 
        // copy
        // paste
        // submit
    })
}