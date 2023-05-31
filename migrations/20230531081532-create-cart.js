'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      menu: {
        type: Sequelize.STRING
      },
      preference: {
        type: Sequelize.TEXT
      },
      servings: {
        type: Sequelize.INTEGER
      },
      meals: {
        type: Sequelize.INTEGER
      },
      total_amount: {
        type: Sequelize.FLOAT
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      preferred_day: {
        type: Sequelize.STRING
      },
      preferred_time: {
        type: Sequelize.STRING
      },
      recurring_sub: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts')
  }
}
