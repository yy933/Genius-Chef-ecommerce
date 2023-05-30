'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.addColumn('Orders', 'show_id', {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.removeColumn('Orders', 'show_id')
  }
}
