'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      duration: {
        type: Sequelize.INTEGER
      },
      total_amount: {
        type: Sequelize.FLOAT
      },
      delivery_name: {
        type: Sequelize.STRING
      },
      delivery_email: {
        type: Sequelize.STRING
      },
      delivery_phone: {
        type: Sequelize.STRING
      },
      delivery_address: {
        type: Sequelize.TEXT
      },
      preferred_day: {
        type: Sequelize.STRING
      },
      preferred_time: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Orders')
  }
}
