const { Sequelize } = require("sequelize");
require("dotenv").config();

// for development enviroment
const devConfig = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;
//for production enviroment
const proConfig = process.env.DATABASE_URL;

const db = new Sequelize(
  process.env.NODE_ENV === "production" ? proConfig : devConfig,
  process.env.NODE_ENV === "production"
    ? {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true, // This will help you. But you will see new error
            rejectUnauthorized: false, // This line will fix new error
          },
        },
      }
    : {
        dialect: "postgres",
        dialectOptions: {},
      }
);

module.exports = db;
