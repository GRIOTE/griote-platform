const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Depot = sequelize.define('Depot', {
  depot_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'DRAFT'
  }
}, { 
  tableName: 'depots', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Depot;
