const express = require("express");
const cors = require("cors");
const initRoutes = require("./app/routes/user.routes");

require('dotenv').config()

global.__baseDir = __dirname;
const app = express();

var corsOptions = {
    origin: process.env.FRONT_END_URL
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

//sync used  to create table
db.dbSequelize.sync()

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Employee salary management application." });
});

initRoutes(app);
// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});