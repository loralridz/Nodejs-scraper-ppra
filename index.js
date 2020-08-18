const express = require('express');
const app = express();

//to work with routes
const pool =require('./db');

//recieve data form client side req.body

//body parser
app.use(express.json());

//html template endpoint
app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

//get function
app.get("/tenders", async (req, res) => {
    const rows = await readtenders();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows));
})

//connecting to server
app.listen(5000, () => {
    console.log("server working.")
})

//start by connecting to db
start()

async function start() {
    await connect();    
}

async function connect() {
    try {
        await pool.connect(); 
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

//read all objects
async function readtenders() {
    try {
        const results = await pool.query("select no, details, advertise_date, closing_date, document from tender");
        return results.rows;
    }
    catch(e){
        return e;
    }
}

//create an object
async function createtenders(num,detail,ad,cd,doc){

    try {
        await pool.query("INSERT INTO tender(no, details, advertise_date, closing_date, document)VALUES(num, detail, ad, cd, doc)");
        console.log("Object created!");
        return true
        }
        catch(e){
            return false;
        }
}

//exporting create function in puppeteer file
module.exports=createtenders;
