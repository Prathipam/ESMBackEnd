'use strict'

require('dotenv').config()
const { APP_SECRET_KEY } = process.env
const { UNAUTHORIZED } = require('http-status')

const auth = (req, res, next) => {

    let authorization = req.headers['authorization']
    let token
    if (authorization) {
        token = authorization.substr(7)
    }

    if (token === APP_SECRET_KEY) {
        next()
        return
    }
    res.status(UNAUTHORIZED).send("Unauthorized")
}

module.exports = auth