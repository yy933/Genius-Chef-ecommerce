'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await Promise.all([
      queryInterface.bulkInsert('Users', [{
        name: 'Admin',
        email: process.env.EMAIL,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('Password12345', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }], {}),
      queryInterface.bulkInsert('Users',
        Array.from({ length: 10 }, () => ({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync(faker.internet.password({ length: 16 }), bcrypt.genSaltSync(10), null),
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        })), {}
      )
    ])
  },
  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Users', {}, { truncate: true, cascade: true })
  }
}
