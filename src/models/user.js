const knex = require('../db');

class User {
    static async findById(id) {
        return await knex('users').where({ id }).first();
    }

    static async findByUsername(username) {
        return await knex('users').where({ username }).first();
    }

    static async create(userData) {
        return await knex('users').insert(userData, 'id');
    }

    static async update(userId, userData) {
        return await knex('users').where({ id: userId }).update(userData);
    }

    static async delete(userId) {
        return await knex('users').where({ id: userId }).del();
    }
}

module.exports = User;
