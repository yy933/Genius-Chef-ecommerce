'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Subscriptions.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Subscriptions.init({
    active: DataTypes.BOOLEAN,
    recurringSub: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Subscriptions',
    tableName: 'Subscriptions',
    underscored: true
  })
  return Subscriptions
}
