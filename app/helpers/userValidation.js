'use strict'

const { isNumeric } = require('./number')
const { isDate } = require('./date');
const db = require("../models");
const User = db.user;
const _ = require("lodash");

exports.userValidation = async (user, csv = false) => {
  let { id, login, name, salary, startDate } = user

  let result = {}
  if (id == '' || login == '' || name == '' || salary == '' || startDate == '') {
    return result = {
      status: 400,
      message: "Missing mandatory field"
    }
  }

  if (!csv) {
    // Check whether the ID is unique
    const countById = await User.count({ where: { id: id.trim() } })

    if (countById) {
      return result = {
        status: 400,
        message: "Employee ID already exists"
      }
    }

    // Check whether the login ID is unique
    const countByLogin = await User.count({ where: { login: login.trim() } })

    if (countByLogin) {
      return result = {
        status: 400,
        message: "Employee login not unique"
      }
    }
  }


  // Check whether the salary is number and greater than zero
  if (!isNumeric(salary) || salary < 0) {
    return result = {
      status: 400,
      message: "Invalid salary"
    }
  }

  // Check the start date format
  if (!(await isDate(startDate, 'YYYY-MM-DD')) && !(await isDate(startDate, 'DD-MMM-YY'))) {
    return result = {
      status: 400,
      message: "Invalid start Date"
    }
  }

  return true
}

