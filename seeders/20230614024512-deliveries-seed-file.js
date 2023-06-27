'use strict'
const { faker } = require('@faker-js/faker')
const randomItem = require('../helpers/random-item')
const optionGroup1 = {
  preferred_day: ['Weekday', 'Weekend'],
  preferred_time: ['Not specified', '9-12', '14-17', '18-20'],
  status: ['Payment not confirmed']
}
const optionGroup2 = {
  preferred_day: ['Weekday', 'Weekend'],
  preferred_time: ['Not specified', '9-12', '14-17', '18-20'],
  status: ['Picking products', 'Ready to ship']
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orderGroup1 = await queryInterface.sequelize.query(
      'SELECT * FROM "Orders" WHERE "Orders".status = :status',
      {
        replacements: { status: 'Payment not confirmed' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const orderGroup2 = await queryInterface.sequelize.query(
      'SELECT * FROM "Orders" WHERE "Orders".status NOT LIKE :status',
      {
        replacements: { status: 'Payment not confirmed' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await Promise.all([
      queryInterface.bulkInsert(
        'Deliveries',
        Array.from({ length: orderGroup1.length }).map((_, index) => ({
          order_id: orderGroup1[index].id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number('## ### ####'),
          address: faker.location.secondaryAddress() + ' ' + faker.location.street() + ', ' + faker.location.city() + ' ' + faker.location.state({ abbreviated: true }) + ' ' + faker.location.zipCode('####'),
          preferred_day: randomItem(optionGroup1.preferred_day),
          preferred_time: randomItem(optionGroup1.preferred_time),
          status: randomItem(optionGroup1.status),
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {}),
      queryInterface.bulkInsert(
        'Deliveries',
        Array.from({ length: orderGroup2.length }).map((_, index) => ({
          order_id: orderGroup2[index].id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number('## ### ####'),
          address: faker.location.secondaryAddress() + ' ' + faker.location.street() + ', ' + faker.location.city() + ' ' + faker.location.state({ abbreviated: true }) + ' ' + faker.location.zipCode('####'),
          preferred_day: randomItem(optionGroup2.preferred_day),
          preferred_time: randomItem(optionGroup2.preferred_time),
          status: randomItem(optionGroup2.status),
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {})
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Deliveries', {}, { truncate: true, cascade: true })
  }
}
