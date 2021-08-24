'use strict'

const moment = require('moment')

async function isDate(dateString, acceptedFormat) {
    const date = moment(dateString, acceptedFormat, true)

    return date.isValid()
}

module.exports = { isDate }