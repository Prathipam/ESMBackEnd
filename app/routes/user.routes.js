const express = require("express");
const router = express.Router();
const users = require("../controllers/user.controller.js");
const { uploadUsers } = require("../controllers/user_upload.controller.js");
const { findAllUsers } = require("../controllers/user_search.controller.js");
const upload = require("../middleware/upload");
const auth = require("../middleware/authentication");

let routes = (app) => {
    // Create a new User
    router.post("/", auth, users.create);

    // Retrieve a single user with id
    router.get("/:id", auth, users.findOne);

    // Retrieve all users
    router.get("/", auth, findAllUsers)

    // Update a Tutorial with id
    router.put("/:id", auth, users.update);

    // Delete a Tutorial with id
    router.delete("/:id", auth, users.delete);

    // Upload users from csv
    router.post("/upload", upload.single("file"), uploadUsers)

    app.use('/api/users', router);
}

module.exports = routes;

