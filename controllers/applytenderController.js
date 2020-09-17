// import db fucntions
const apply = require('../config/queryfunctions/applytenders');

exports.applytender = async(req, res) => {
    await apply(req.body.namet);
    res.send("      You have successfully applied for Tender : " + req.body.namet);
};