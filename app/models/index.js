const dbConfig = require("../config/db.js");

const Sequelize = require("sequelize");
const dbSequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    timezone: '+08:00',
});

const db = {};

db.Sequelize = Sequelize;
db.dbSequelize = dbSequelize;

db.user = require("./user.model.js")(dbSequelize, Sequelize);

module.exports = db;