const db = require("../models");
const {Sequelize} = require("sequelize");
const Action = db.action;
const Op = db.Sequelize.Op;


exports.insert_action = (action) => {
    const created_action = Action.create(action);
    return created_action;
};