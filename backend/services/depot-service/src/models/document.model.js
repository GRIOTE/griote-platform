const { DataTypes } = require('sequelize');
const sequelize = require('../../shared/config/db.config');

const Document = sequelize.define('Document', {
  document_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  resource_type: { type: DataTypes.STRING(50), allowNull: false },
  resource_id: { type: DataTypes.INTEGER, allowNull: false },
  file_url: { type: DataTypes.STRING(512), allowNull: false },
  file_name: { type: DataTypes.STRING(255), allowNull: false },
  file_type: { type: DataTypes.STRING(50), allowNull: false },
  file_size: { type: DataTypes.BIGINT, allowNull: false },
  is_main: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  tableName: 'documents', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [{ fields: ['resource_type', 'resource_id'] }]
});

module.exports = Document;