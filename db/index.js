const { Sequelize } = require("sequelize");
require("dotenv").config();

const devConfig = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;
const proConfig = process.env.DB_URL;

const db = new Sequelize(
  process.env.NODE_ENV === "production" ? proConfig : devConfig,
  {
    logging: false,
  }
);

module.exports = db;
