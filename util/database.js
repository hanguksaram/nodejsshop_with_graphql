const mysql = require('mysql2')
const config = require('../config.json')

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    database: config.db.schema,
    password: config.db.password
})

module.exports = pool.promise();