//import db
const pool = require("../db");

// check applied tenders
async function appliedtenders() {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE status='apply'");

        return results.rows;
    } catch (e) {
        return e;
    }
};

module.exports = appliedtenders;