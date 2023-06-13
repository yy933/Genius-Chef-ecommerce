'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM "Users" WHERE "Users".role = :role',
      {
        replacements: { role: 'user' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await queryInterface.bulkInsert(
      'Subscriptions',
      Array.from({ length: 11 }).map((_, index) => ({
        user_id: users[index].id,
        active: false,
        recurring_sub: Boolean(Math.floor(Math.random() * 1000) % 2),
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {})
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Subscriptions', {}, { truncate: true, cascade: true })
  }
}
