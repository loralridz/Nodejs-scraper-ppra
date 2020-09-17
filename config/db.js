const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    password: "postgres",
    database: "postgres",
    host: "localhost",
    port: 5433
});

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
module.exports = pool;