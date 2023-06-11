'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.changeColumn('Subscriptions', 'recurring_sub', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.changeColumn('Subscriptions', 'recurring_sub', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  }
}
