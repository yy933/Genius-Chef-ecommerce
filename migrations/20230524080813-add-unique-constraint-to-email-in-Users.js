'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.changeColumn('Users', 'email', {
      unique: true,
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING
    })
  }
}
