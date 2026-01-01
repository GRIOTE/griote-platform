const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const DepotCategory = sequelize.define('DepotCategory', {
  category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT }
}, { 
  tableName: 'depot_categories', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = DepotCategory;
