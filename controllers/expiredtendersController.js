// import db fucntions
const expire = require('../config/queryfunctions/expiredtenders');


exports.expiredtenders = async(req, res) => {
    const rows = await expire();

    //notify browser and send all objects
    res.render("tenders.ejs", {
        result: rows
    });
};