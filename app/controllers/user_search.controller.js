const _ = require("lodash");
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const { isNumeric } = require('../helpers/number')

// Retrieve all Users from the database.

exports.findAllUsers = async (req, res) => {
    const { minSalary = 0, maxSalary = 4000, offset = 0, limit = 10, filter, sort } = req.query

    // Filtering based on minimum and maximum salary
    let minSalaryValue
    let maxSalaryValue
    const min = Number.parseFloat(minSalary)
    const max = Number.parseFloat(maxSalary)

    if (isNumeric(min) && min >= 0) {
        minSalaryValue = min
    }

    if (isNumeric(max) && max > 0) {
        if (minSalaryValue > max)
            return res.status(400).send({ "message": "Maximum Salary must be greater than minimum salary" });
        maxSalaryValue = max
    }

    let where = {
        salary: {
            [Op.gte]: minSalaryValue,
            [Op.lt]: maxSalaryValue,
        },
    }

    //Custom Filter for name, login, Id  
    if (filter) {
        where[Op.or] = [{
            id: {
                [Op.like]: `%${filter}%`
            }
        },
        {
            name: {
                [Op.like]: `%${filter}%`
            }
        },
        {
            login: {
                [Op.like]: `%${filter}%`
            }
        }
        ]
    }

    //Sorting
    let field = 'id'
    let order = 'ASC'
    let orderBy
    if (sort) {
        if (sort.includes('-')) {
            field = sort.split('-')[0]
            order = sort.split('-')[1]
        } else {
            field = sort
        }
    }
    orderBy = [field, order]

    //PAGINATION
    const pageAsNumber = Number.parseInt(offset)
    const sizeAsNumber = Number.parseInt(limit)

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber
    }

    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
        size = sizeAsNumber
    }

    const users = await User.findAndCountAll({
        where: where,
        limit: size,
        order: [[orderBy]],
        offset: page * size
    })
    if (users.count > 0)
        return res.send({
            results: users.rows,
            totalItems: users.count
        });
    return res.send({
        results: [],
        totalItems: 0
    });
};
