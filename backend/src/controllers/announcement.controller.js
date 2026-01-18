const announcementService = require('../services/announcement.service');

// ================== PUBLIC ==================

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant' });
    }

    const image = await announcementService.uploadImage(
      req.file,
      req.body.description || 'Announcement preview'
    );

    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllPublished = async (_req, res) => {
  try {
    const announcements = await announcementService.getAllPublished();
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const announcement = await announcementService.getById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ================== ADMIN ==================

exports.create = async (req, res) => {
  try {
    const announcement = await announcementService.create({
      ...req.body,
      image: req.file, // fichier uploadé
      removePreview: req.body.removePreview === 'true',
      author_id: req.user.id
    });

    res.status(201).json(announcement);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const announcement = await announcementService.update(req.params.id, {
      ...req.body,
      image: req.file, // fichier uploadé
      removePreview: req.body.removePreview === 'true'
    });

    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await announcementService.delete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.publish = async (req, res) => {
  try {
    const announcement = await announcementService.publish(req.params.id);
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.archive = async (req, res) => {
  try {
    const announcement = await announcementService.archive(req.params.id);
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.getAllForAdmin = async (_req, res) => {
  try {
    const announcements = await announcementService.getAllForAdmin();
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
