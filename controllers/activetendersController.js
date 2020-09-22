// import db fucntions
const active = require('../config/queryfunctions/activetenders');

exports.activetenders = async(req, res) => {
    const rows = await active();
    res.render("active.ejs", {
        result: rows
    });
};