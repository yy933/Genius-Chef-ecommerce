'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ResetToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      ResetToken.belongsTo(models.User, { foreignKey: 'userEmail' })
    }
  }
  ResetToken.init({
    userEmail: DataTypes.STRING,
    token: DataTypes.STRING,
    expiration: DataTypes.DATE,
    used: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ResetToken',
    tableName: 'ResetTokens',
    underscored: true
  })
  return ResetToken
}
