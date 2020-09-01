//Importing Nodejs puppeteer 
const puppeteer = require("puppeteer");


var c = 0;

//Async function for getting data
async function scrap() {

    // Result async function for logic to run in the browser
    const result = async url => {

        // launching headless chrome browser
        const browser = await puppeteer.launch({
            headless: true
        });
        // Opening up new page and going to provided url
        const page = await browser.newPage();
        await page.goto(url);
        const dataresult = await page.evaluate(() => {
            //get whole table rows
            const tb = document.querySelector(
                "body > div:nth-child(14) > table > tbody > tr:nth-child(4) > td > form > div > table > tbody"
            );
            //array declared
            let data = [];
            if (tb)

                for (let ii = 2; ii < tb.childElementCount; ii++) {
                // Gets whole row
                const tr = tb.children[ii];
                //Object declared
                let rowData = {};
                for (let jj = 0; jj < tr.childElementCount; jj++) {
                    //Get one cell
                    const td = tr.children[jj];
                    if (jj == 0) {
                        rowData.No = td.innerText;
                    } else if (jj == 1) {
                        rowData.Detail = td.innerText;
                    } else if (jj == 2) {
                        const cell = td;
                        // Cell gets P then gets a then href in a
                        rowData.Document = cell.firstElementChild.firstElementChild.href;
                    } else if (jj == 3) {
                        rowData.Advertise_date = td.innerText;
                    } else if (jj == 4) {
                        rowData.Close_date = td.innerText;
                    }
                }
                // Pushing object in array
                data.push(rowData);
            }

            return data;
        });
        await page.close();

        // Recursively scrape the next page
        if ((result.length < 1) || (c > 10)) {
            // Terminate if no result page exist
            return dataresult;
        } else {
            // Go fetch the next page ?page=X+1
            const nextPageNumber = parseInt(url.match(/PageNo=(\d+)$/)[1], 10) + 1;
            const nextUrl = `https://www.ppra.org.pk/dad_tenders.asp?PageNo=${nextPageNumber}`;
            c++;
            //concat the next url
            return dataresult.concat(await result(nextUrl));
        }
    };

    const browser = await puppeteer.launch();
    const firstUrl =
        "https://www.ppra.org.pk/dad_tenders.asp?PageNo=1";
    //update result in scraped_data
    const scraped_data = await result(firstUrl);
    await browser.close();

    //return result
    return scraped_data;
}

// export scraper
module.exports = { scrap }