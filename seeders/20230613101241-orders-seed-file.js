'use strict'
const priceRule = require('../helpers/price-calculation')
const orderOptions = {
  menu: ['Classic', 'Vegetarian'],
  preference: ['Dairy free', 'Gluten free', 'Lacto-ovo vegetarian', 'Nutritious and healthy', 'Pescatarian', 'Quick and easy', 'N/A'],
  servings: [2, 4, 6],
  meals: [2, 3, 4, 5, 6],
  status: ['Payment not confirmed', 'Payment confirmed']
}
const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}
const randomPlanPrice = (servings, meals) => {
  const randomServings = randomItem(servings)
  const randomMeals = randomItem(meals)
  const totalAmount = priceRule(servings, meals)
  return { servings: randomServings, meals: randomMeals, totalAmount }
}
const priceResults = Array.from({ length: 11 }).map(() => (randomPlanPrice(orderOptions.servings, orderOptions.menu)))
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
      'Orders',
      Array.from({ length: 11 }).map((_, index) => ({
        user_id: users[index].id,
        menu: randomItem(orderOptions.menu),
        preference: randomItem(orderOptions.preference),
        servings: 2,
        meals: 4,
        total_amount: 71.92,
        status: randomItem(orderOptions.status),
        show_id: Date.now().toString() + users[index].id,
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {})
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Orders', {}, { truncate: true, cascade: true })
  }
}
