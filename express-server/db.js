const pg = require('pg')
const fs = require('fs')
require('dotenv').config()

const pool = new pg.Pool({
    user: 'jorgelias',
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./global-bundle.pem'),
    }
});
const getSchedule=async()=>{
    const query='SELECT * FROM schedule ORDER BY date'
    const re = await pool.query(query)
    return re
}
const addToSchedule=async(appt)=>{
    const query=`INSERT INTO schedule 
    (name, email, phone, service, address, destination, date, time) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
    await pool.query(query, [
        appt.name, 
        appt.email, 
        appt.phone, 
        appt.service, 
        appt.address, 
        appt.destination, 
        appt.date, 
        appt.time
    ])
}
const cleanSchedule=async()=>{
    let today = new Date();
    today = new Date(today.getTime() - 8*60 * 60 * 1000)
    today = today.toISOString().slice(0,10);
    const query='DELETE FROM schedule WHERE date < $1'
    await pool.query(query, [today]);
}
const getDates=async()=>{
    const query='SELECT date FROM schedule ORDER BY date'
    const re = await pool.query(query) 
    return re;
}
// const addUser=async()=>{

// }
module.exports = {
    getSchedule,
    // addUser,
    addToSchedule,
    cleanSchedule,
    getDates,
}