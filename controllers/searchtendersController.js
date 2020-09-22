// import db fucntions
const search = require('../config/queryfunctions/searchtenders');
const searchk = require('../config/queryfunctions/searchktenders');

exports.searchtenders = async(req, res) => { // user route

    if(req.body.search){
        //city search
        var city = req.body.search;

        function toUpper(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
    
        regexp = /^[A-Z]/;
        if (regexp.test(city)) {
             const rows = await search(city);
             res.render("file.ejs", {
                 result: rows
             });
         } else {
             const rows = await search(toUpper(city));
             res.render("file.ejs", {
                 result: rows
             });
         }

        const rows = await search(city);
        console.log(1);
        res.render("file.ejs", {
                result: rows
        });
    
    }
    else{
        var keyword = req.body.keyword;
        //keyword search 
        const rows = await searchk(keyword);
        console.log(2);
        res.render("file.ejs", {
                result: rows
        });
    }
    


   
   
};