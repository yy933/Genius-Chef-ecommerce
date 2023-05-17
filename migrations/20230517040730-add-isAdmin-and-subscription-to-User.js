'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.addColumn(
      'Users',
      'role',
      {
        type: Sequelize.STRING,
        defaultValue: 'user'
      }
    )
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.removeColumn('Users', 'role')
  }
}
