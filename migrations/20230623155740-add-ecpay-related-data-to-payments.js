'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Payments', 'ecpay_merchant_trade_no', {
        type: Sequelize.STRING,
        unique: true
      }),
      queryInterface.addColumn('Payments', 'ecpay_trade_no', {
        type: Sequelize.STRING,
        unique: true
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Payments', 'ecpay_merchant_trade_no'),
      queryInterface.removeColumn('Payments', 'ecpay_trade_no')
    ])
  }
}
