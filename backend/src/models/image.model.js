const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Image = sequelize.define('Image', {
  image_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  imageable_type: {
    type: DataTypes.ENUM('announcement', 'user', 'depot'),
    allowNull: false
  },
  imageable_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Image;
