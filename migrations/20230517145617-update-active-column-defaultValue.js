'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.changeColumn('Subscriptions', 'active', {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
      allowNull: false
    })
  },
  async down (queryInterface, Sequelize) {
    return await queryInterface.changeColumn('Subscriptions', 'active',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false
      })
  }
}
