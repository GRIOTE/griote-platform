const { Depot, Document, DepotTag, sequelize, Image } = require('../models');
const minioService = require('./minio.service');

async function createDepot(data, userId) {
  const t = await sequelize.transaction();
  try {
    const { title, description, category_id, tag_ids } = data;

    const depot = await Depot.create({
      owner_id: userId,
      title,
      description,
      category_id,
      status: 'DRAFT'
    }, { transaction: t });

    if (tag_ids?.length) {
      const mappings = tag_ids.map(tag_id => ({
        depot_id: depot.depot_id,
        tag_id
      }));
      await sequelize.models.DepotTagMapping.bulkCreate(mappings, { transaction: t });
    }

    await t.commit();
    return depot;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function getDepotById(depotId) {
  const depot = await Depot.findByPk(depotId, {
    include: [
      'category',
      { model: Document, as: 'documents' },
      { model: DepotTag, as: 'tags', through: { attributes: [] } },
      { model: Image, as: 'previewImage' }
    ]
  });
  if (!depot) throw new Error('Depot not found');
  return depot;
}

async function getAllDepots(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.owner_id) where.owner_id = filters.owner_id;
  if (filters.category_id) where.category_id = filters.category_id;

  const depots = await Depot.findAll({
    where,
    include: [
      'category',
      { model: Document, as: 'documents' },
      { model: DepotTag, as: 'tags', through: { attributes: [] } },
      { model: Image, as: 'previewImage' }
    ],
    order: [['created_at', 'DESC']]
  });
  return depots;
}

async function updateDepot(depotId, data) {
  const [affectedRows] = await Depot.update(data, { where: { depot_id: depotId } });
  if (affectedRows === 0) throw new Error('Depot not found');
  return await getDepotById(depotId);
}

async function deleteDepot(depotId) {
  const deletedRows = await Depot.destroy({ where: { depot_id: depotId } });
  if (deletedRows === 0) throw new Error('Depot not found');
  return true;
}

async function addDocumentToDepot(depotId, documentData, userId) {
  // Assuming documentData has file buffer, originalname, mimetype, size
  const { file } = documentData;

  const depot = await Depot.findByPk(depotId);
  if (!depot) throw new Error('Depot not found');

  const url = await minioService.upload(file, `depot-${depotId}`);

  const document = await Document.create({
    depot_id: depotId,
    owner_id: userId,
    filename: file.originalname,
    url,
    file_type: file.mimetype,
    file_size: file.size
  });

  return document;
}

async function getDepotDocuments(depotId) {
  const depot = await Depot.findByPk(depotId);
  if (!depot) throw new Error('Depot not found');

  const documents = await Document.findAll({
    where: { depot_id: depotId },
    order: [['created_at', 'DESC']]
  });
  return documents;
}

module.exports = {
  createDepot,
  getDepotById,
  getAllDepots,
  updateDepot,
  deleteDepot,
  addDocumentToDepot,
  getDepotDocuments
};