const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Document = sequelize.define('Document', {
  document_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  depot_id: { type: DataTypes.INTEGER, allowNull: false },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  url: { type: DataTypes.STRING(512), allowNull: false },
  file_type: { type: DataTypes.STRING(50), allowNull: true },
  file_size: { type: DataTypes.BIGINT, allowNull: true }
}, {
  tableName: 'documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [{ fields: ['depot_id'] }]
});

module.exports = Document;
