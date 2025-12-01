const { DataTypes } = require('sequelize');
const sequelize = require('../../shared/config/db.config');

const DepotTag = sequelize.define('DepotTag', {
  tag_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'depot_tags', timestamps: false });

module.exports = DepotTag;