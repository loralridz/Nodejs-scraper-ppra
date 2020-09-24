//import db
const pool = require("../db");

// check city matched tenders
async function searchtenders(city) {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE city=($1) ", [city]);
        return results.rows;
    } catch (e) {
        return e;
    }
};

module.exports = searchtenders;