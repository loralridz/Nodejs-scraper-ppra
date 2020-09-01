//server 
const express = require('express');
const app = express();

//import DB
const pool = require('./db');

//import scrapper
const scrap = require('./scrap');

//body parser
app.use(express.json());

//html template endpoint
app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

//get function to read all objs
app.get("/tenders", async(req, res) => {
    const rows = await readtenders();
    //notify browser and send all objects
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
})

//get scrapped data
app.get("/scraptenders", async(req, res) => {

    // await for scrapper to return scraped array 
    const result = await scrap.scrap();

    // loop through array objects
    result.forEach(async(tender) => {
        //check status
        status = checkStatus(getDate(tender.Advertise_date), getDate(tender.Close_date));
        //create row in db 
        await createtender(tender.No, tender.Detail, getDate(tender.Advertise_date), getDate(tender.Close_date), tender.Document, status);

    });
    //Success response
    res.send("Successfully written scraped data.");

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

// New tenders
// Applied tenders
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
async function readtenders() {

    try {
        const results = await pool.query("select no, detail, advertise_date, closing_date, document from tender");
        return results.rows;
    } catch (e) {
        return e;
    }
}

//create an object in DB
async function createtender(no, detail, ad, cd, doc) {

    await pool.query('INSERT INTO tender(no, detail, advertise_date, closing_date, document) VALUES ($1,$2,$3,$4,$5)', [no, detail, ad, cd, doc],
        function(err, result) {
            if (err) {
                console.log("Error Saving : %s ", err);
            }

        });
}

// check until today active tenders

async function activetenders() {

    try {
        const results = await pool.query("SELECT * FROM tender  WHERE closing_date>='2020-8-29 00:00:00' ");
        return results.rows;
    } catch (e) {
        return e;
    }
}


// check expired tenders
var curday = function(sp) {
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return (dd + sp + mm + sp + yyyy);
};
async function expiredtenders() {
    varr = curday('-');
    console.log(varr);
    try {
        const results = await pool.query("SELECT * FROM tender  WHERE closing_date <= varr ");
        return results.rows;
    } catch (e) {
        return e;
    }
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function getDate(date) {

    const pieces = (date.replace(/(\r\n|\n|\r)/gm, " ")).split(" ");
    console.log("pieces" + pieces);
    const r = pieces[0].split("/");
    const rm = [r[0], r[1], r[2]];
    console.log("rm" + rm);
    var str2 = replaceAll(rm.toString(), ",", "-");
    if (pieces.length == 1) {
        return str2;
    } else {
        console.log((str2 + " " + pieces[1].toString() + " " + pieces[2]));
        return (str2 + " " + pieces[1].toString() + " " + pieces[2]);
    }

}