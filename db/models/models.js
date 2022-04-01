const db = require("../index");
const { DataTypes } = require("sequelize");

const Users = db.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(64),
    validate: {
      is: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
    },
    allowNull: false,
  },
});

const Room = db.define("rooms", {
  roomname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Password = db.define("passwords", {
  roomname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { Users, Room, Password };
