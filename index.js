//server 
const express = require('express');
const app = express();

//import DB
const pool = require('./db');

//import scrapper
const scrap = require('./scrap');

//body parser
var bodyParser = require('body-parser')
var parser = bodyParser.json();

app.use(express.json());

app.get("/tenders", async(req, res) => {
    const rows = await readtenders();
    //notify browser and send all objects
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
})

//get scrapped data
app.get("/scraptenders", async(req, res) => {
    /*
        // await for scrapper to return scraped array 
        const result = await scrap.scrap();

        // loop through array objects
        result.forEach(async(tender) => {
            const status = getStatus(tender.Advertise_date, tender.Close_date);

            //create row in db 
            await createtender(tender.No, tender.Detail, get_date(tender.Advertise_date), get_date(tender.Close_date), tender.Document, status);

        });
        //Success response
        res.send("Successfully written scraped data.");
    */
})

// Active tenders
app.get("/activetenders", async(req, res) => {
    const rows = await activetenders();
    //notify browser and send all objects
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
})

// Expired tenders
app.get("/expiredtenders", async(req, res) => {
    const rows = await expiredtenders();

    //notify browser and send all objects
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
})

// Applied tenders
app.get('/applied/:id', async(req, res) => {
        //UPDATE tender SET status='new' WHERE no = 'TS427526E';
        await status(req.params.id);
        res.send("You have applied for " + req.params.id);
    })
    // create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//apply 'from html template
app.post('/apply', urlencodedParser, async(req, res) => {
        await status(req.body.namet);
        res.send("      You have successfully applied for Tender : " + req.body.namet);
    })
    //connecting to server
app.listen(5000, () => {
    console.log("server working...")
})

//start by connecting to db
start();
async function start() {
    await connect();
}

async function connect() {
    try {
        await pool.connect();
        console.log("Succesfully connected to DB.")
    } catch (e) {
        console.error(`Failed to connect ${e}`)
    }
}

//read and return all objects from DB 
/*async function readtenders() {

    try {
        // select no, detail, advertise_date, closing_date, document from tender
        const results = await pool.query("select no, detail, advertise_date, closing_date, document from tender where serial > 10 and serial < 15 LIMIT 5");
        return results.rows;
    } catch (e) {
        return e;
    }
}*/
async function readtenders() {

    try {
        // select no, detail, advertise_date, closing_date, document from tender
        const results = await pool.query("select no, detail, advertise_date, closing_date, document from tender ");
        return results.rows;
    } catch (e) {
        return e;
    }
}

//create an object in DB
async function createtender(no, detail, ad, cd, doc, st) {

    await pool.query('INSERT INTO tender(no, detail, advertise_date, closing_date, document,status) VALUES ($1,$2,$3,$4,$5,$6)', [no, detail, ad, cd, doc, st],
        function(err, result) {
            if (err) {
                console.log("Error Saving : %s ", err);
            }

        });
}
// check until today active tenders

async function activetenders() {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE status='active' ");
        return results.rows;
    } catch (e) {
        return e;
    }
}


// check expired tenders

async function expiredtenders() {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE status='expired'");

        return results.rows;
    } catch (e) {
        return e;
    }
}

// check expired tenders

async function status(id) {
    try {
        const results = await pool.query(" UPDATE tender SET status='apply' WHERE no = ($1) ", [id]);
        console.log("done");
    } catch (e) {
        console.log("no");
    }
}

function getStatus(ad, cd) {

    var date = curday();

    const ad1 = (ad.replace(/(\r\n|\n|\r)/gm, " ")).split(" ");
    const cd1 = (cd.replace(/(\r\n|\n|\r)/gm, " ")).split(" ");

    const r1 = ad1[0].split("/");
    const rm1 = [r1[2], r1[1], r1[0]];

    const r2 = cd1[0].split("/");
    const rm2 = [r2[2], r2[1], r2[0]];

    var aad1 = replaceAll(rm1.toString(), ",", "-");
    var ccd1 = replaceAll(rm2.toString(), ",", "-");


    const closeDate = new Date(ccd1);

    const curDate = new Date(date);

    //active tenders
    if (curDate > closeDate) {
        return "expired";
    }
    // expired tenders
    else {
        return "active";
    }
}

var curday = function() {
    sp = '-';
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return (yyyy + sp + mm + sp + dd);

};

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function get_date(date) {

    const pieces = (date.replace(/(\r\n|\n|\r)/gm, " ")).split(" ");

    const r = pieces[0].split("/");
    const rm = [r[2], r[1], r[0]];
    var str2 = replaceAll(rm.toString(), ",", "-");

    if (pieces.length == 1) {
        return str2;
    } else {
        return (str2 + " " + pieces[1].toString());
    }

}