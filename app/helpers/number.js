'use strict'

exports.isNumeric = number => {
    return !isNaN(parseFloat(number)) && isFinite(number)
}
