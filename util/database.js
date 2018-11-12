const mysql = require("mysql2");
const Sequelize = require("sequelize");
const config = require("../config.json");

const { host, user, schema, password } = config.db;
const sequelize = new Sequelize(schema, user, password, {
  dialect: "mysql",
  host
});

module.exports = sequelize;
