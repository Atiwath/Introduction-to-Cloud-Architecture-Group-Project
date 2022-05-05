const mysql = require('mysql2');
const dbConnection = mysql.createPool({
    host     : 'localhost', // MYSQL HOST NAME
    user     : 'root', // MYSQL USERNAME
    password : '', // MYSQL PASSWORD
    database : 'cloud4' // MYSQL DB NAME
}).promise()
module.exports = dbConnection;