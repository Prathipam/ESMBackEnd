
'use strict'
const duplicates = require('find-array-duplicates')

exports.checkArrDuplicate = (arr, key) => {
    const result = duplicates(arr, key).single()
    if (!result)
        return false
    return true
}