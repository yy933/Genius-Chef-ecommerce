'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Payments', 'paypal_payment_id', {
      type: Sequelize.STRING,
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Payments', 'paypal_payment_id')
  }
}
