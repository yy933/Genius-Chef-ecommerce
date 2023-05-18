'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Orders', 'duration', { transaction: t }),
        queryInterface.removeColumn('Orders', 'delivery_name', { transaction: t }),
        queryInterface.removeColumn('Orders', 'delivery_email', { transaction: t }),
        queryInterface.removeColumn('Orders', 'delivery_phone', { transaction: t }),
        queryInterface.removeColumn('Orders', 'delivery_address', { transaction: t }),
        queryInterface.removeColumn('Orders', 'preferred_day', { transaction: t }),
        queryInterface.removeColumn('Orders', 'preferred_time', { transaction: t })
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Orders', 'duration', { type: Sequelize.INTEGER }, { transaction: t }),
        queryInterface.addColumn('Orders', 'delivery_name', { type: Sequelize.STRING }, { transaction: t }),
        queryInterface.addColumn('Orders', 'delivery_email', { type: Sequelize.STRING }, { transaction: t }),
        queryInterface.addColumn('Orders', 'delivery_phone', { type: Sequelize.STRING }, { transaction: t }),
        queryInterface.addColumn('Orders', 'delivery_address', { type: Sequelize.TEXT }, { transaction: t }),
        queryInterface.addColumn('Orders', 'preferred_day', { type: Sequelize.STRING }, { transaction: t }),
        queryInterface.addColumn('Orders', 'preferred_time', { type: Sequelize.STRING }, { transaction: t })
      ])
    })
  }
}
