'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' })
      Order.hasOne(models.Payment)
      Order.hasOne(models.Delivery)
    }
  }
  Order.init({
    menu: DataTypes.STRING,
    preference: DataTypes.TEXT,
    servings: DataTypes.INTEGER,
    meals: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    total_amount: DataTypes.FLOAT,
    delivery_name: DataTypes.STRING,
    delivery_email: DataTypes.STRING,
    delivery_phone: DataTypes.STRING,
    delivery_address: DataTypes.TEXT,
    preferred_day: DataTypes.STRING,
    preferred_time: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}
