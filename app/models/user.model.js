module.exports = (dbSequelize, Sequelize) => {
    const User = dbSequelize.define("User", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        login: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        salary: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        startDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true
    });

    return User;
};