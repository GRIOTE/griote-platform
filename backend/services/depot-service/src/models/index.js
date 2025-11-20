const sequelize = require('../config/db.config');
const Depot = require('./depot.model');
const Document = require('./document.model');
const DepotCategory = require('./depotCategory.model');
const DepotTag = require('./depotTag.model');

// Associations
Depot.belongsTo(DepotCategory, { foreignKey: 'category_id' });
DepotCategory.hasMany(Depot, { foreignKey: 'category_id' });

Depot.hasMany(Document, { foreignKey: 'resource_id', scope: { resource_type: 'DEPOT' } });
Document.belongsTo(Depot, { foreignKey: 'resource_id', constraints: false });

Depot.belongsToMany(DepotTag, { through: 'depot_tag_mappings' });
DepotTag.belongsToMany(Depot, { through: 'depot_tag_mappings' });

module.exports = {
  sequelize,
  Depot,
  Document,
  DepotCategory,
  DepotTag
};