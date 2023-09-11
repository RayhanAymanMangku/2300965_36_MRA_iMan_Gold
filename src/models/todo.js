const knex = require('../database');

class Todo {
    static async findAllByUserId(userId) {
        return await knex('todos').where({ user_id: userId });
    }

    static async findById(todoId) {
        return await knex('todos').where({ id: todoId }).first();
    }

    static async create(todoData) {
        return await knex('todos').insert(todoData, 'id');
    }

    static async update(todoId, todoData) {
        return await knex('todos').where({ id: todoId }).update(todoData);
    }

    static async delete(todoId) {
        return await knex('todos').where({ id: todoId }).del();
    }
}

module.exports = Todo;
