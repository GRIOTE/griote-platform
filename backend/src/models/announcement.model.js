const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Announcement = sequelize.define('Announcement', {
  announcement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author_id: { type: DataTypes.INTEGER, allowNull: false },
  titre: { type: DataTypes.STRING, allowNull: false },
  contenu: { type: DataTypes.TEXT, allowNull: false },
  statut: {
    type: DataTypes.ENUM('pending', 'published', 'archived'),
    defaultValue: 'pending'
  },
  date_creation: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date_publication: { type: DataTypes.DATE, allowNull: true },
  image_apercu_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'announcements',
  timestamps: false
});

module.exports = Announcement;
