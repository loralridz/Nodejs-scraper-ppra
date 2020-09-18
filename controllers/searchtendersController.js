// import db fucntions
const search = require('../config/queryfunctions/searchtenders');

exports.searchtenders = async(req, res) => { // user route

    var city = req.body.search;

    function toUpper(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    regexp = /^[A-Z]/;
    if (regexp.test(city)) {
        const rows = await search(city);
        console.log(rows);
        res.render("file.ejs", {
            result: rows
        });
    } else {
        const rows = await search(toUpper(city));
        console.log(rows);
        res.render("file.ejs", {
            result: rows
        });
    }

};