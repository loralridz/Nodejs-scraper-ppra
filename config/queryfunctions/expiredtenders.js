//import db
const pool = require("../db");

// check expired tenders
async function expiredtenders() {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE status='expired'");

        return results.rows;
    } catch (e) {
        return e;
    }
};

//export the function
module.exports = expiredtenders;