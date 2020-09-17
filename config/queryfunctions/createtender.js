//import db
const pool = require("../db");

//create an object in DB
async function createtender(no, detail, ad, cd, doc, st, city) {

    await pool.query('INSERT INTO tender(no, detail, advertise_date, closing_date, document,status,city) VALUES ($1,$2,$3,$4,$5,$6,$7)', [no, detail, ad, cd, doc, st, city],
        function(err, result) {
            console.log('New Tender added to DB...');
            if (err) {
                console.log("Error Saving : %s ", err);
            }

        });
};

module.exports = createtender;