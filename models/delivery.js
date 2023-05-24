'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Delivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Delivery.belongsTo(models.Order, { foreignKey: 'orderId' })
    }
  }
  Delivery.init({
    orderId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    preferredDay: DataTypes.STRING,
    preferredTime: DataTypes.STRING,
    status: DataTypes.STRING,
    deliveredAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Delivery',
    tableName: 'Deliveries',
    underscored: true
  })
  return Delivery
}
