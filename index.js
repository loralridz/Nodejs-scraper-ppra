//server 
const express = require('express');
const app = express();

//import DB
const pool = require('./config/db');

//import scrapper
const scrap = require('./scrap');

const session = require('express-session');
const flash = require('express-flash')
const passport=require('passport');
const initializePassport=require('./config/passportconfig');
initializePassport(passport);

//
const bcrypt = require('bcrypt');


//setting ejs engine
app.set('view engine', 'ejs');

//connecting to server
app.listen(8000, () => {
    console.log("server working...")
})

//body parser
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//------------- FILE ROUTES ----------------------- //

//middlewares
//static files route
app.use(express.static(__dirname + '/public'));

//session middleware
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//flash middleware
app.use(flash());

// home dashboard route
app.get("/",  checkNotAuthenticated,async(req, res) => {
    res.render("home.ejs", { user: req.user.name });
});

//paginated url
app.get("/tenders", async(req, res) => { // user route
    //var data = req.query.page;
    var limit = 100;
    var offset = (req.query.page - 1) * (limit) + 1;

    const rows = await readtenders(limit, offset);
    // const result = JSON.parse(rows);
    res.render("file.ejs", {
        result: rows
    });
});

// All tenders route
app.get("/alltenders", async(req, res) => {
    const rows = await readtenders(100, 0);
    //notify browser and send all objects
    // res.setHeader("content-type", "application/json");
    res.render("file.ejs", {
        result: rows
    });
})

//get scrapped data
app.get("/scraptenders", async(req, res) => {

    // await for scrapper to return scraped array 
    const ppra_tenders = await scrap.scrap();


    const db_tenders = await readtenders();
    // loop through array objects
    result.forEach(async(tender) => {
        //create row in db 

        if (db_tenders.filter(e => e.no == tender.No).length > 0) {
            console.log('duplicate found and it was discarded...');

        } else {
            const status = getStatus(tender.Advertise_date, tender.Close_date);
            const city = citySelector(tender.city);
            await createtender(tender.No, tender.Detail, get_date(tender.Advertise_date), get_date(tender.Close_date), tender.Document, status, city);
        }




    });
    //Success response
    res.send("Successfully written scraped data.");

});


// Active tenders route
app.get("/activetenders", async(req, res) => {
    const rows = await activetenders();
    //notify browser and send all objects
    // res.setHeader("content-type", "application/json");
    res.render("pagination.ejs", {
        result: rows
    });
})

// Expired tenders route
app.get("/expiredtenders", async(req, res) => {
    const rows = await expiredtenders();

    //notify browser and send all objects
    res.render("file.ejs", {
        result: rows
    });
});

// Expired tenders route
app.get("/appliedtenders", async(req, res) => {
    const rows = await appliedtenders();
    //const totalrows = await counttenders();
    //notify browser and send all objects
    // console.log(totalrows);
    res.render("file.ejs", {
        result: rows
    });
});


// city query results
app.post("/searchtenders", urlencodedParser, async(req, res) => { // user route

    var city = req.body.search;

    function toUpper(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    regexp = /^[A-Z]/;
    if (regexp.test(city)) {
        const rows = await searchtenders(city);
        res.render("file.ejs", {
            result: rows
        });
    } else {
        const rows = await searchtenders(toUpper(city));
        res.render("file.ejs", {
            result: rows
        });
    }

});

// Applied tenders route
app.get('/applied/:id', async(req, res) => {
    //UPDATE tender SET status='new' WHERE no = 'TS427526E';
    await status(req.params.id);
    res.send("You have applied for " + req.params.id);
})

//apply 'from html template
app.post('/apply', urlencodedParser, async(req, res) => {
    await status(req.body.namet);
    res.send("      You have successfully applied for Tender : " + req.body.namet);
})

//------------- Login and sign up ----------------------- //
app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register.ejs");
  });
  
  app.get("/users/login", (req, res) => {
    // flash sets a messages variable. passport sets the error message
    //console.log(req.session.flash.error);
    res.render("login.ejs");
  });

  app.get("/users/logout", (req, res) => {
    req.logout();
    res.render("login.ejs", { message: "You have logged out successfully" });
  });

app.post("/users/register", urlencodedParser, async(req, res) => {
    //gettig data from ejs file
    let { name, email, password, password2 } = req.body;
    let errors = [];
    //validation checks
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields!" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long!" });
    }

    if (password !== password2) {
        errors.push({ message: "Passwords do not match!" });
    }
    if (errors.length > 0) {
        res.render("register", { errors, name, email, password, password2 });
    }  else {
        let hashedPassword = await bcrypt.hash(password, 10);
        // Validation passed
        pool.query(
            `SELECT * FROM public.user
            WHERE email = $1`, [email],
            (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    errors.push({
                        message: "Email already registered"
                    });
                    res.render("register",{errors} );
                } else {
                    pool.query(
                        `INSERT INTO public.user (name, email, password)
                    VALUES ($1, $2, $3)
                    RETURNING id, password`, [name, email, hashedPassword],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/users/login");
                        }
                    );
                }
            }
        );
    } 
});
app.post("/users/login",urlencodedParser,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true
    })
  );
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  }
  
//------------- DB CONNECTION & QUERY FUCNTIONS ----------------------- //

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

//read all from db
async function readtenders(limit, offset) {
    try {

        const results = await pool.query("select no, detail, advertise_date, closing_date, document from tender LIMIT ($1) OFFSET ($2) ", [limit, offset]);
        //console.log(results.rows);
        return results.rows;
    } catch (e) {
        return e;
    }
}

//create an object in DB
async function createtender(no, detail, ad, cd, doc, st, city) {

    await pool.query('INSERT INTO tender(no, detail, advertise_date, closing_date, document,status,city) VALUES ($1,$2,$3,$4,$5,$6,$7)', [no, detail, ad, cd, doc, st, city],
        function(err, result) {
            console.log('New Tender added to DB...');
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

// check city matched tenders

async function searchtenders(city) {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE city=($1) ", [city]);

        return results.rows;
    } catch (e) {
        return e;
    }
}


// count all tenders

async function counttenders() {

    try {
        const result = await pool.query("SELECT COUNT(*) FROM tender");
        console.log(result.rows.length);
        return result;
    } catch (e) {
        return e;
    }
}

// check applied tenders

async function appliedtenders() {

    try {
        const results = await pool.query("SELECT DISTINCT no,detail,advertise_date,closing_date,document FROM tender WHERE status='apply'");

        return results.rows;
    } catch (e) {
        return e;
    }
}

// check expired tenders

async function status(id) {
    try {
        const results = await pool.query(" UPDATE tender SET status='apply' WHERE no = ($1) ", [id]);
        //console.log("done");
    } catch (e) {
        console.log("no");
    }
}


//------------- HELPER FUCNTIONS ----------------------- //

// used in createtender fucntion to set status of newly scraped tender
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

// gives current date
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

// string separtor
function citySelector(main) {

    var str = main.split(',');

    var x = str[1].toString();
    const str1 = x.trim();
    return str1;

}
// date formatter
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