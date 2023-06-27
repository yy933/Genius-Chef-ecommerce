'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT "Users".id FROM "Users" WHERE "Users".role = :role',
      {
        replacements: { role: 'user' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const userGroup1 = []
    const userGroup2 = []
    for (let i = 0; i < users.length; i++) {
      if (i % 2 === 0) {
        userGroup1.push(users[i])
      } else {
        userGroup2.push(users[i])
      }
    }

    await Promise.all([
      queryInterface.bulkInsert(
        'Subscriptions',
        Array.from({ length: userGroup1.length }).map((_, index) => ({
          user_id: userGroup1[index].id,
          active: false,
          recurring_sub: Boolean(Math.floor(Math.random() * 1000) % 2),
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {}),
      queryInterface.bulkInsert(
        'Subscriptions',
        Array.from({ length: userGroup2.length }).map((_, index) => ({
          user_id: userGroup2[index].id,
          active: true,
          recurring_sub: Boolean(Math.floor(Math.random() * 1000) % 2),
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {})
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Subscriptions', {}, { truncate: true, cascade: true })
  }
}
