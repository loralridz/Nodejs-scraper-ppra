
//Nodejs puppeteer library importing
const puppeteer = require("puppeteer");

//import index file module 'createtender'
const index =require('./index');
 
//Async function for getting data
(async() => {
 
    // Result async function for logic to run in the browser
    const result = async url => {
        // laucnhing headless chrome browser
        const browser = await puppeteer.launch({
            headless: true
        });
        // Opening up new page and going to provided url
        const page = await browser.newPage();
        await page.goto(url);
        const dataresult = await page.evaluate(() => {
            const tb = document.querySelector(
                "body > div:nth-child(14) > table > tbody > tr:nth-child(4) > td > form > div > table > tbody"
            );
            //array declared
            let data = [];
            if (tb)
                for (let ii = 2; ii < tb.childElementCount; ii++) {
 
                    // Gets whole row
                    const tr = tb.children[ii];
 
                    //Object 
                    let rowData = {};
 
                    for (let jj = 0; jj < tr.childElementCount; jj++) {
                        //Get one cell
                        const td = tr.children[jj];
                        if (jj == 0) {
                            rowData.No = td.innerText;
                        } else if (jj == 1) {
                            rowData.Details = td.innerText;
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
                    
                    //calling create method from index file to create row in DB
                    index(rowData.No, rowData.Details, rowData.Advertise_date, rowData.Close_date, rowData.Document);
                    
                        
                    
                }
 
 
            return data;
 
 
        });
        await page.close();
 
        // Recursively scrape the next page
        if (result.length < 1) {
            // Terminate if no result page exist
            return dataresult;
        } else {
            // Go fetch the next page ?page=X+1
            const nextPageNumber = parseInt(url.match(/PageNo=(\d+)$/)[1], 10) + 1;
            const nextUrl = `https://www.ppra.org.pk/dad_tenders.asp?PageNo=${nextPageNumber}`;
 
            //concat the next url
            return dataresult.concat(await result(nextUrl));
        }
    };
    const browser = await puppeteer.launch();
    const firstUrl =
        "https://www.ppra.org.pk/dad_tenders.asp?PageNo=1";
    const partners = await result(firstUrl);
 
    // Todo: Update database with partners
    console.log(partners);
    console.log("Data written");
    await browser.close();
})();
