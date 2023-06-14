'use strict'
const { faker } = require('@faker-js/faker')
const randomItem = require('../helpers/random-item')
const deliveryOptions = {
  preferred_day: ['Weekday', 'Weekend'],
  preferred_time: ['Not specified', '9-12', '14-17', '18-20'],
  status: ['Payment not confirmed', 'Payment confirmed', 'Ready to ship']
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orders = await queryInterface.sequelize.query(
      'SELECT * FROM "Orders" ',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )

    await queryInterface.bulkInsert(
      'Deliveries',
      Array.from({ length: 11 }).map((_, index) => ({
        order_id: orders[index].id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number('## ### ####'),
        address: faker.location.secondaryAddress() + ' ' + faker.location.street() + ', ' + faker.location.city() + ' ' + faker.location.state({ abbreviated: true }) + ' ' + faker.location.zipCode('####'),
        preferred_day: randomItem(deliveryOptions.preferred_day),
        preferred_time: randomItem(deliveryOptions.preferred_time),
        status: randomItem(deliveryOptions.status),
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {})
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Deliveries', {}, { truncate: true, cascade: true })
  }
}
