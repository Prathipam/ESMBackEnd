
const _ = require("lodash");

const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const { isNumeric } = require('../helpers/number')
const { isDate } = require('../helpers/date')

const { userValidation } = require('../helpers/userValidation');

exports.create = async (req, res) => {
  let { id, login, name, salary, startDate } = req.body
  salary = _.toNumber(salary)

  const user = {
    id: id,
    login: login,
    name: name,
    salary: salary,
    startDate: startDate
  };
  const result = await userValidation(user)

  if (_.isObjectLike(result)) {
    return res.status(result.status).send({ message: result.message })
  } else if (result) {
    User.create(user)
      .then(data => {
        return res.status(201).send({ "message": "Successfully created" });
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  }
}

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data)
        return res.status(200).send(data);

      return res.status(400).send({
        message: "No such employee with Id:" + id
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while finding the User."
      });
    });
};


exports.update = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const id = req.params.id;
  const { login, salary, name, startDate } = req.body

  // 1. Check whether the ID is unique
  const dbUser = await User.findOne({ where: { id: id.trim() } })
  const user = {}
  if (!dbUser) {
    return res.status(400).send({
      message: "No such employee"
    });
  }

  // 2. Check whether the login ID is unique
  if (login !== dbUser.login) {

    const countByLogin = await User.count({ where: { login: login.trim() } })

    if (countByLogin) {
      return res.status(400).send({
        message: "Employee login not unique"
      });
    }

    user.login = login
  }

  // 3. Check whether the salary is number and greater than zero
  if (salary) {
    if (!isNumeric(salary) || salary < 0) {
      return res.status(400).send({
        message: "Invalid salary"
      });
    }

    user.salary = _.toNumber(salary)
  }

  // 4. Check the start date format
  if (startDate) {
    if (!(await isDate(startDate, 'YYYY-MM-DD')) && !(await isDate(startDate, 'DD-MMM-YY'))) {
      return res.status(400).send({
        message: "Invalid start Date"
      });
    }

    user.startDate = startDate
  }

  if (name) {
    user.name = name
  }

  User.update(user, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Successfully updated"
        });
      } else {
        res.status(400).send({
          message: `Nothing updated with id=${id}. Maybe req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating user with id=" + id
      });
    });

};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Successfully deleted"
        });
      } else {
        res.status(400).send({
          message: `No Such Employee`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

