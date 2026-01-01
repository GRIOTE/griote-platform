const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Announcement = sequelize.define('Announcement', {
  announcement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'published', 'archived'),
    defaultValue: 'pending'
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  published_at: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'announcements',
  timestamps: false
});

module.exports = Announcement;
