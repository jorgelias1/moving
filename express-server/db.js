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
const postQuestion=async(number, question)=>{
    const query=
    `INSERT INTO questions (number, question)
    VALUES ($1, $2)`
    await pool.query(query, [number, question]);
}
const postAppt=async(location, service, pay)=>{
    const query=
    `INSERT INTO past_appts (location, service, pay)
    VALUES ($1, $2, $3)`
    await pool.query(query, [location, service, pay]);
}
const getAppt=async()=>{
    const query='SELECT * FROM past_appts'
    const re = await pool.query(query);
    return re;
}
const getQuestions=async()=>{
    const query='SELECT * FROM questions'
    const re = await pool.query(query);
    return re;
}
const removeQuestion=async(question)=>{
    const query='DELETE FROM questions WHERE question=$1 AND number=$2'
    await pool.query(query, [question.question, question.number])
}
// const addUser=async()=>{

// }
module.exports = {
    getSchedule,
    // addUser,
    addToSchedule,
    cleanSchedule,
    getDates,
    postQuestion,
    postAppt,
    getAppt,
    getQuestions,
    removeQuestion,
}