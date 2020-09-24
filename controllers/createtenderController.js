// import db fucntions
const create = require('../config/queryfunctions/createtender');
const rt = require('../config/queryfunctions/readtenders');
const sc = require('../scrap');


exports.createtender = async(req, res) => {

    // await for scrapper to return scraped array 
    const result = await sc.scrap();


    const db_tenders = await rt();
    // loop through array objects
    result.forEach(async(tender) => {
        //create row in db 

        if (db_tenders.filter(e => e.no == tender.No).length > 0) {
            console.log('duplicate found and it was discarded...');

        } else {
            const status = getStatus(tender.Advertise_date, tender.Close_date);
            const city = citySelector(tender.city);
            await create(tender.No, tender.Detail, get_date(tender.Advertise_date), get_date(tender.Close_date), tender.Document, status, city);
        }




    });
    //Success response
    res.send("Successfully written scraped data.");

};