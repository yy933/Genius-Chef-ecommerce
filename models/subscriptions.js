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
      Subscriptions.hasOne(models.User)
    }
  }
  Subscriptions.init({
    active: DataTypes.BOOLEAN,
    recurring_sub: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Subscriptions',
    tableName: 'Subsciptions',
    underscored: true
  })
  return Subscriptions
}
