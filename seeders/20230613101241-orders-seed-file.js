'use strict'
const randomItem = require('../helpers/random-item')
const { showIdGenerator } = require('../helpers/ecpay-helper')
const OptionGroup = {
  menu: ['Classic', 'Vegetarian'],
  preference: ['Dairy free', 'Gluten free', 'Lacto-ovo vegetarian', 'Nutritious and healthy', 'Pescatarian', 'Quick and easy', 'N/A'],
  servings: [2, 4, 6],
  meals: [2, 3, 4, 5, 6],
  statusOption1: ['Payment not confirmed'],
  statusOption2: ['Payment confirmed', 'Picking products']
}

const plansPrice = [
  { servings: 2, meals: 2, totalAmount: 992 },
  { servings: 6, meals: 4, totalAmount: 4992 },
  { servings: 2, meals: 5, totalAmount: 2280 },
  { servings: 6, meals: 5, totalAmount: 5640 },
  { servings: 2, meals: 3, totalAmount: 1488 },
  { servings: 6, meals: 6, totalAmount: 6768 },
  { servings: 6, meals: 3, totalAmount: 3744 },
  { servings: 4, meals: 5, totalAmount: 4160 },
  { servings: 6, meals: 2, totalAmount: 2736 },
  { servings: 4, meals: 4, totalAmount: 3648 },
  { servings: 4, meals: 2, totalAmount: 1984 }
]

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
    const userGroup1 = await queryInterface.sequelize.query(
      'SELECT "Users".*, "Subscriptions".active FROM "Users" INNER JOIN "Subscriptions" ON ("Users".id = "Subscriptions".user_id AND "Users".role = :role AND "Subscriptions".active = :active)',
      {
        replacements: { role: 'user', active: false },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const userGroup2 = await queryInterface.sequelize.query(
      'SELECT "Users".*, "Subscriptions".active FROM "Users" INNER JOIN "Subscriptions" ON ("Users".id = "Subscriptions".user_id AND "Users".role = :role AND "Subscriptions".active = :active)',
      {
        replacements: { role: 'user', active: true },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await Promise.all([queryInterface.bulkInsert(
      'Orders',
      Array.from({ length: userGroup1.length }).map((_, index) => ({
        user_id: userGroup1[index].id,
        menu: randomItem(OptionGroup.menu),
        preference: randomItem(OptionGroup.preference),
        servings: plansPrice[index % 11].servings,
        meals: plansPrice[index % 11].meals,
        total_amount: plansPrice[index % 11].totalAmount,
        status: randomItem(OptionGroup.statusOption1),
        show_id: showIdGenerator(userGroup1[index].id),
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {}),
    queryInterface.bulkInsert(
      'Orders',
      Array.from({ length: userGroup2.length }).map((_, index) => ({
        user_id: userGroup2[index].id,
        menu: randomItem(OptionGroup.menu),
        preference: randomItem(OptionGroup.preference),
        servings: plansPrice[index % 11].servings,
        meals: plansPrice[index % 11].meals,
        total_amount: plansPrice[index % 11].totalAmount,
        status: randomItem(OptionGroup.statusOption2),
        show_id: showIdGenerator(userGroup2[index].id),
        created_at: new Date(),
        updated_at: new Date()
      })
      ), {})
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Orders', {}, { truncate: true, cascade: true })
  }
}
