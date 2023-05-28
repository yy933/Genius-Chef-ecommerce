'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.addColumn(
      'Users',
      'twitter_id',
      {
        type: Sequelize.STRING
      }
    )
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.removeColumn(
      'Users',
      'twitter_id'
    )
  }
}
