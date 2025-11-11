const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Daniel35215525*',
    database: 'educa'
});

module.exports = connection;