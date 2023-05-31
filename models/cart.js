'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Cart.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    menu: DataTypes.STRING,
    preference: DataTypes.TEXT,
    servings: DataTypes.INTEGER,
    meals: DataTypes.INTEGER,
    totalAmount: DataTypes.FLOAT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    preferredDay: DataTypes.STRING,
    preferredTime: DataTypes.STRING,
    recurringSub: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    underscored: true
  })
  return Cart
}
