let puppeteer = require("puppeteer");
let fs = require("fs");
let links = ["https://www.amazon.in", "https://www.flipkart.com", "https://paytmmall.com/"]
let pName = process.argv[2];

(async function () {

    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            // args: ["--start-maximized",]
        });
        let AmazonArr = await getListingFromAmazon(links[0], browserInstance, pName);
        console.table(AmazonArr);

        let FlipkartArr = await getListingFromFlipkart(links[1], browserInstance, pName);
        console.table(FlipkartArr);

        let PaytmMallArr = await getListingFromPaytmMall(links[2], browserInstance, pName);
        console.table(PaytmMallArr);

    } catch (err) {
        console.log(err);
    }

})();


async function getListingFromAmazon(link, browserInstance, pName) {
    let newTab = await browserInstance.newPage();
    await newTab.goto(link);
    await newTab.type("#twotabsearchtextbox", pName, { delay: 100 });
    await newTab.keyboard.press("Enter");
    await newTab.waitForSelector(".a-price-whole", { visible: true });

    function extractText(priceSelector, pNameSelector){
        let priceArr = document.querySelectorAll(priceSelector);
        let pName = document.querySelectorAll(pNameSelector);
        let details = [];
        for (let i = 0; i < 5; i++){

            let price = priceArr[i].innerText;
            let Name = pName[i].innerText;
            details.push({
                Name, price
            });
        }
        return details;
    }
    return await newTab.evaluate(extractText, ".a-price-whole", ".a-size-medium.a-color-base.a-text-normal");
    // console.log(detailArr);

}

async function getListingFromFlipkart(link, browserInstance, pName){
    let newTab = await browserInstance.newPage();
    await newTab.goto(link);
    await newTab.click("._2KpZ6l._2doB4z");
    await newTab.type("._3704LK", pName, { delay: 100 });
    await newTab.keyboard.press("Enter");

    await newTab.waitForSelector(".s1Q9rs", { visible: true });

    function extractText(priceSelector, pNameSelector){
        let priceArr = document.querySelectorAll(priceSelector);
        let pName = document.querySelectorAll(pNameSelector);
        let details = [];
        for (let i = 0; i < 5; i++){

            let price = priceArr[i].innerText;
            let Name = pName[i].innerText;
            details.push({
                Name, price
            });
        }
        return details;
    }
    return await newTab.evaluate(extractText, "._30jeq3", ".s1Q9rs");
    // ._4rR01T
}

async function getListingFromPaytmMall(link, browserInstance, pName){
    let newTab = await browserInstance.newPage();
    await newTab.goto(link);
    await newTab.type("#searchInput", pName, { delay: 100 });
    await newTab.keyboard.press("Enter");

    await newTab.waitForSelector(".pCOS .UGUy", { visible: true });

    function extractText(priceSelector, pNameSelector){
        let priceArr = document.querySelectorAll(priceSelector);
        let pName = document.querySelectorAll(pNameSelector);
        let details = [];
        for (let i = 0; i < 5; i++){

            let price = priceArr[i].innerText;
            let Name = pName[i].innerText;
            details.push({
                Name, price
            });
        }
        return details;
    }
    return await newTab.evaluate(extractText, ".pCOS ._1kMS", ".pCOS .UGUy");

}