const { Depot, Document, DepotTag } = require('../models');
const minioService = require('../services/minio.service');

exports.create = async (req, res) => {
  const t = await Depot.sequelize.transaction();
  try {
    const { title, description, category_id, tag_ids } = req.body;
    const files = req.files || [];

    // 1. Créer le dépôt
    const depot = await Depot.create({
      owner_id: req.user.user_id,
      title, description, category_id,
      status: 'DRAFT'
    }, { transaction: t });

    // 2. Upload tous les fichiers vers MinIO
    const docs = await Promise.all(
      files.map(async (file) => {
        const url = await minioService.upload(file, `depot-${depot.depot_id}`);
        return {
          depot_id: depot.depot_id,
          owner_id: req.user.user_id,
          filename: file.originalname,
          url: url,
          file_type: file.mimetype,
          file_size: file.size
        };
      })
    );
    await Document.bulkCreate(docs, { transaction: t });

    // 3. Ajouter les tags
    if (tag_ids?.length) {
      const mappings = tag_ids.map(tag_id => ({
        depot_id: depot.depot_id,
        tag_id
      }));
      await Depot.sequelize.models.DepotTagMapping.bulkCreate(mappings, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ depot_id: depot.depot_id, files_uploaded: files.length });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.mine = async (req, res) => {
  const depots = await Depot.findAll({
    where: { owner_id: req.user.user_id },
    include: [
      'category',
      { model: Document, as: 'documents' },
      { model: DepotTag, as: 'tags', through: { attributes: [] } }
    ],
    order: [['created_at', 'DESC']]
  });
  res.json(depots);
};

exports.listAll = async (req, res) => {
  const depots = await Depot.findAll({
    include: [
      'category',
      { model: Document, as: 'documents' },
      { model: DepotTag, as: 'tags', through: { attributes: [] } }
    ],
    order: [['created_at', 'DESC']]
  });
  res.json(depots);
};

exports.update = async (req, res) => {
  const { depot_id } = req.params;
  const [n] = await Depot.update(req.body, { where: { depot_id } });
  if (!n) return res.status(404).json({ error: 'Not found' });
  const depot = await Depot.findByPk(depot_id, {
    include: [
      'category',
      { model: Document, as: 'documents' },
      { model: DepotTag, as: 'tags', through: { attributes: [] } }
    ]
  });
  res.json(depot);
};

exports.delete = async (req, res) => {
  const { depot_id } = req.params;
  const n = await Depot.destroy({ where: { depot_id } });
  n ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found' });
};

/* ========================= STATS ENDPOINTS ========================= */

exports.getTotalDepots = async (req, res) => {
  try {
    const count = await Depot.count();
    return res.json({ totalDepots: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTotalDocuments = async (req, res) => {
  try {
    const count = await Document.count();
    return res.json({ totalDocuments: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};