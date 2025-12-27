const sequelize = require('../config/db.config');
const User = require('./user.model');
const RefreshToken = require('./refreshToken.model');
const Depot = require('./depot.model');
const Document = require('./document.model');
const DepotCategory = require('./depotCategory.model');
const DepotTag = require('./depotTag.model');

// Associations User
User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Associations Depot
Depot.belongsTo(User, { foreignKey: 'owner_id' });
User.hasMany(Depot, { foreignKey: 'owner_id' });

Depot.belongsTo(DepotCategory, { foreignKey: 'category_id' });
DepotCategory.hasMany(Depot, { foreignKey: 'category_id' });

Depot.hasMany(Document, { 
  foreignKey: 'resource_id', 
  constraints: false,
  scope: { resource_type: 'DEPOT' }
});
Document.belongsTo(Depot, { 
  foreignKey: 'resource_id', 
  constraints: false 
});

Depot.belongsToMany(DepotTag, { through: 'depot_tag_mappings' });
DepotTag.belongsToMany(Depot, { through: 'depot_tag_mappings' });

module.exports = {
  sequelize,
  User,
  RefreshToken,
  Depot,
  Document,
  DepotCategory,
  DepotTag
};