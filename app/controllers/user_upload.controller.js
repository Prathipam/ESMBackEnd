const path = require('path')
const fs = require('fs')
const csv = require("fast-csv");
const { checkArrDuplicate } = require('../helpers/checkArrDuplicate');
const { userValidation } = require('../helpers/userValidation');
const db = require("../models");
const User = db.user;
const _ = require("lodash");

// Create bulk upload
exports.uploadUsers = async (req, res) => {

    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }

        let users = [];
        let errors = [];
        let uploadedPath = path.join(__baseDir, "uploads", req.file.filename);

        fs.createReadStream(uploadedPath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", async (row) => {

                // Ignore if the line starts with #
                if (!row.id.startsWith('#')) {
                    //validate the row
                    const result = await userValidation(row, true)

                    if (_.isObjectLike(result)) {
                        errors.push(`${result.message} with Id: ${row.id}`)
                    } else if (result) {
                        users.push(row);
                    }
                }
            })
            .on("end", () => {
                console.log(errors)
                //Field level validation
                if (errors.length > 0) {
                    return res.status(400).send({
                        message: errors
                    });
                }

                // Check for duplicate Id
                const isDuplicateIdExist = checkArrDuplicate(users, 'id')
                if (isDuplicateIdExist) {
                    return res.status(400).send({
                        message: 'Duplicate ID exists'
                    });
                }

                // Check for duplicate login
                const isDuplicateLoginExist = checkArrDuplicate(users, 'login')
                if (isDuplicateLoginExist) {
                    return res.status(400).send({
                        message: 'Duplicate login exists'
                    });
                }

                User.bulkCreate(users, {
                    updateOnDuplicate: ['login', 'name', 'salary', 'startDate'],
                })
                    .then(() => {
                        res.status(200).send({
                            message:
                                "File uploaded successfully: " + req.file.originalname,
                        });
                    })
                    .catch((error) => {
                        res.status(500).send({
                            message: "Fail to import data into database!",
                            error: error.message,
                        });
                    });
            });
    } catch (error) {
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};