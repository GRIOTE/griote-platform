const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const RefreshToken = sequelize.define('RefreshToken', {
  token_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = RefreshToken;
