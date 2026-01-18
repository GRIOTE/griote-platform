const { Document } = require('../models');
const minioService = require('../services/minio.service');

async function upload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { depot_id } = req.body;
    const url = await minioService.uploadFile(req.file);

    const document = await Document.create({
      depot_id: parseInt(depot_id),
      owner_id: req.user.user_id,
      filename: req.file.originalname,
      url: url,
      file_type: req.file.mimetype,
      file_size: req.file.size
    });

    return res.status(201).json({ message: 'File uploaded successfully', document });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getById(req, res) {
  try {
    const { document_id } = req.params;
    const document = await Document.findByPk(document_id, {});

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    return res.json(document);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getDepotDocuments(req, res) {
  try {
    const { depot_id } = req.params;
    const documents = await Document.findAll({
      where: { depot_id: depot_id },
      order: [['created_at', 'DESC']]
    });

    return res.json(documents);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function deleteDocument(req, res) {
  try {
    const { document_id } = req.params;
    const document = await Document.findByPk(document_id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await minioService.deleteFile(document.url);
    await document.destroy();

    return res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  upload,
  getById,
  getDepotDocuments,
  deleteDocument
};
