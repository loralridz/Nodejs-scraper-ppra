// import db fucntions
const apply = require('../config/queryfunctions/appliedtenders');

exports.appliedtenders = async(req, res) => {
    const rows = await apply();
    //const totalrows = await counttenders();
    //notify browser and send all objects
    // console.log(totalrows);
    res.render("tenders.ejs", {
        result: rows
    });
};