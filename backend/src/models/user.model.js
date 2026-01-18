const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER' },
  is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  bio: { type: DataTypes.TEXT, allowNull: true },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
  linkedin_url: { type: DataTypes.STRING, allowNull: true },
  github_url: { type: DataTypes.STRING, allowNull: true },
  website_url: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
