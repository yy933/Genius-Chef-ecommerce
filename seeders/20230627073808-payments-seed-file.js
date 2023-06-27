'use strict'
const randomItem = require('../helpers/random-item')
const optionGroup = {
  payment_method: ['Paypal', 'Credit Card']
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orderGroup1 = await queryInterface.sequelize.query(
      'SELECT "Orders".id, "Orders".total_amount FROM "Orders" WHERE "Orders".status = :status',
      {
        replacements: { status: 'Payment not confirmed' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const orderGroup2 = await queryInterface.sequelize.query(
      'SELECT "Orders".id, "Orders".total_amount FROM "Orders" WHERE "Orders".status NOT LIKE :status',
      {
        replacements: { status: 'Payment not confirmed' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await Promise.all([
      queryInterface.bulkInsert(
        'Payments',
        Array.from({ length: orderGroup1.length }).map((_, index) => ({
          order_id: orderGroup1[index].id,
          status: 'Payment not confirmed',
          total_amount: orderGroup1[index].total_amount,
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {}),
      queryInterface.bulkInsert(
        'Payments',
        Array.from({ length: orderGroup2.length }).map((_, index) => ({
          order_id: orderGroup2[index].id,
          status: 'Payment confirmed',
          payment_method: randomItem(optionGroup.payment_method),
          total_amount: orderGroup2[index].total_amount,
          paid_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {})
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Payments', {}, { truncate: true, cascade: true })
  }
}
