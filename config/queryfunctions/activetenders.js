//import db
const pool = require("../db");

// check until today active tenders
async function activetenders() {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE status='active' ");
        return results.rows;
    } catch (e) {
        return e;
    }
};


module.exports = activetenders;