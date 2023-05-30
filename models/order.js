'use strict'
const {
  Model, DATE
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.hasOne(models.Payment)
      Order.hasOne(models.Delivery)
    }
  }
  Order.init({
    id: DataTypes.INTEGER,
    menu: DataTypes.STRING,
    preference: DataTypes.TEXT,
    servings: DataTypes.INTEGER,
    meals: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    totalAmount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    showId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}
