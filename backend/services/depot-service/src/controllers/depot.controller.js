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
          resource_type: 'DEPOT',
          resource_id: depot.depot_id,
          file_url: url,
          file_name: file.originalname,
          file_type: file.mimetype,
          file_size: file.size,
          is_main: file.fieldname === 'main_file'
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