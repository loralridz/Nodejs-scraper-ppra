//server 
const express = require('express');
const app = express();

//import DB
const pool =require('./db');

//import scrapper
const scrap = require('./scrap');

//body parser
app.use(express.json());

//html template endpoint
app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

//get function to read all objs
app.get("/tenders", async (req, res) => {
    const rows = await readtenders();
    //notify browser and send all objects
    res.setHeader("content-type", "application/json");   
    res.send(JSON.stringify(rows));
})

//get scrapped data
app.get("/scraptenders", async (req, res) => {

    // await for scrapper to return scraped array 
    const result = await scrap.scrap();

    // loop through array objects
    result.forEach(async (tender)=> {
        //create row in db 
        await createtender(tender.No, tender.Details, tender.Advertise_date, tender.Close_date, tender.Document);
                       
    });
    //Success response
    res.send("Successfully written scraped data.");

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
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

//read and return all objects from DB 
async function readtenders() {
  
    try {
        const results = await pool.query("select no, details, advertise_date, closing_date, document from tender");
        return results.rows;
    }
    catch(e){
        return e;
    }
}

//create an object in DB
async function createtender(no,detail,ad,cd,doc){
   
        await pool.query('INSERT INTO tender(no, details, advertise_date, closing_date, document) VALUES ($1,$2,$3,$4,$5)' ,[no,detail,ad,cd,doc],
        function (err, result) {
            if (err) {
                console.log("Error Saving : %s ", err);
            }
           
        });
}
