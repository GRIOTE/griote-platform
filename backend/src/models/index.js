const sequelize = require('../config/db.config');
const User = require('./user.model');
const RefreshToken = require('./refreshToken.model');
const Depot = require('./depot.model');
const Document = require('./document.model');
const DepotCategory = require('./depotCategory.model');
const DepotTag = require('./depotTag.model');
const Announcement = require('./announcement.model');
const Image = require('./image.model');

// === Associations User ===
User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Depot, { foreignKey: 'owner_id' });
Depot.belongsTo(User, { foreignKey: 'owner_id' });

// Toutes les images d'un utilisateur
User.hasMany(Image, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'user' },
  as: 'images'
});

// Photo de profil : la plus récente parmi les images de type 'user'
User.hasOne(Image, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'user' },
  as: 'profilePicture',
  order: [['created_at', 'DESC']] // ← la plus récente devient la photo de profil
});

// === Associations Depot ===
Depot.belongsTo(DepotCategory, { foreignKey: 'category_id' });
DepotCategory.hasMany(Depot, { foreignKey: 'category_id' });

Depot.hasMany(Document, { foreignKey: 'depot_id' });
Document.belongsTo(Depot, { foreignKey: 'depot_id' });

Depot.belongsToMany(DepotTag, { through: 'depot_tag_mappings' });
DepotTag.belongsToMany(Depot, { through: 'depot_tag_mappings' });

// Image de preview du dépôt : la plus récente parmi les images de type 'depot'
Depot.hasOne(Image, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'depot' },
  as: 'previewImage',
  order: [['created_at', 'DESC']] // ← la plus récente devient la preview
});

Image.belongsTo(Depot, { foreignKey: 'imageable_id', constraints: false });

// === Associations Announcement ===
Announcement.hasMany(Image, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'announcement' },
  as: 'images'
});
Image.belongsTo(Announcement, { foreignKey: 'imageable_id', constraints: false });

Announcement.belongsTo(Image, { foreignKey: 'image_apercu_id', as: 'previewImage' });

Announcement.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
User.hasMany(Announcement, { foreignKey: 'author_id' });

// === Export ===
module.exports = {
  sequelize,
  User,
  RefreshToken,
  Depot,
  Document,
  DepotCategory,
  DepotTag,
  Announcement,
  Image
};