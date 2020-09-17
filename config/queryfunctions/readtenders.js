//import db
const pool = require("../db");

//read all tenders from db
async function readtenders(limit, offset) {
    try {
        await pool.connect()
        const results = await pool.query("select no, detail, advertise_date, closing_date, document from tender LIMIT ($1) OFFSET ($2) ", [limit, offset]);
        return results.rows;
    } catch (e) {
        return e;
    }
}

module.exports = readtenders;