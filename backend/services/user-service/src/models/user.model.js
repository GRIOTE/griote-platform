const { DataTypes } = require('sequelize');
const sequelize = require('../../shared/config/db.config');


const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER' },
  is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  tableName: 'users', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;