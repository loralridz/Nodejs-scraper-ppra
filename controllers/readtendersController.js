// import db fucntions
const rt = require('../config/queryfunctions/readtenders');

exports.readtenders = async(req, res) => {

    var limit = 100;
    var offset = (req.query.page - 1) * (limit) + 1;

    const rows = await rt(limit,offset);
    //notify browser and send all objects
    // res.setHeader("content-type", "application/json");
    res.render("tenders.ejs", {
        result: rows
    });
};