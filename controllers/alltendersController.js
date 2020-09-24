// import db fucntions
const rt = require('../config/queryfunctions/readtenders');

exports.tenders = async(req, res) => {
    const rows = await rt(100, 0);
    //notify browser and send all objects
    // res.setHeader("content-type", "application/json");
    res.render("tenders.ejs", {
        result: rows
    });
};