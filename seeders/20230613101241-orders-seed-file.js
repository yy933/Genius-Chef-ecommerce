'use strict'

const orderOptions = {
  menu: ['Classic', 'Vegetarian'],
  preference: ['Dairy free', 'Gluten free', 'Lacto-ovo vegetarian', 'Nutritious and healthy', 'Pescatarian', 'Quick and easy', 'N/A'],
  servings: [2, 4, 6],
  meals: [2, 3, 4, 5, 6],
  status: ['Payment not confirmed', 'Payment confirmed']
}
const plansPrice = [
  { servings: 4, meals: 2, totalAmount: 71.92 },
  { servings: 6, meals: 4, totalAmount: 198.96 },
  { servings: 2, meals: 5, totalAmount: 84.9 },
  { servings: 4, meals: 5, totalAmount: 165.8 },
  { servings: 2, meals: 6, totalAmount: 101.88 },
  { servings: 4, meals: 5, totalAmount: 165.8 },
  { servings: 6, meals: 3, totalAmount: 149.22 },
  { servings: 4, meals: 5, totalAmount: 165.8 },
  { servings: 6, meals: 2, totalAmount: 101.88 },
  { servings: 4, meals: 4, totalAmount: 135.84 },
  { servings: 4, meals: 2, totalAmount: 71.92 }
]
const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}
// const randomPlanPrice = (servings, meals) => {
//   const randomServings = randomItem(servings)
//   const randomMeals = randomItem(meals)
//   const totalAmount = priceRule(servings, meals)
//   return { servings: randomServings, meals: randomMeals, totalAmount }
// }
// const priceResults = Array.from({ length: 11 }).map(() => (randomPlanPrice(orderOptions.servings, orderOptions.meals)))
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
        servings: plansPrice[index % 11].servings,
        meals: plansPrice[index % 11].meals,
        total_amount: plansPrice[index % 11].totalAmount,
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
