//import db
const pool = require("../db");

// change applied status
async function status(id) {
    try {
        const results = await pool.query(" UPDATE tender SET status='apply' WHERE no = ($1) ", [id]);
        //console.log("done");
    } catch (e) {
        console.log("no");
    }
}

module.exports = status;