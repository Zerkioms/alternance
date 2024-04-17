const db = require("../models");
const {Sequelize} = require("sequelize");
const { user } = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

exports.insert_user = (user) => {
    const created_user = User.create(user);
    return created_user;
};

exports.find_all = (req, res, next) => {
    let users_list = User.findAll({include: [Role]});
    return users_list;
};

exports.find_by_id = (req, res, next, id) => {
    let user = User.findByPk(id);
    return user;
};

exports.update_user = (req, res, next, id) => {
   let updated = User.update(req.body, {where: { id: id } } );
   return updated;
};

exports.delete_user = (req, res, next, id) => {
   let destroyed = User.destroy({where: { id: id } } )
   return destroyed;
};

exports.delete_all = (req, res, next) => {
    User.destroy({
        where: {},
        truncate: false
    }).then(user => {
        res.json(user);
    })
};

exports.find_by_uid = async (user) => {
    let user_returned = null
    await User.findOrCreate({
        where: {uid: user.uid},
        include: [Role],
        defaults: {
            id_role: 3,
            nom: user.family_name,
            prenom: user.given_name,
        }
    }).then(result => {
        user_returned = result[0]
    })
    return user_returned
}

exports.findRoles = (req, res, next) => {
    let roles = Role.findAll();
    return roles;
}

exports.updateRole = (user) => {
    let updated = User.update({id_role: user.role.id}, {where: { id: user.id } } );
    return updated;
}


