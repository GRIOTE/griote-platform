const { DataTypes } = require('sequelize');
const sequelize = require('../../shared/config/db.config');

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
});

module.exports = RefreshToken;
