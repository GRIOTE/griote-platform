const { Announcement, Image } = require('../models');
const { Op } = require('sequelize');

// ================== PUBLIC ==================

// Get all published announcements
async function getAllPublished(req, res) {
  try {
    const announcements = await Announcement.findAll({
      where: { statut: 'publié' },
      include: [{
        model: Image,
        as: 'previewImage',
        required: false
      }],
      order: [['date_publication', 'DESC']]
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get announcement by ID
async function getById(req, res) {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id, {
      include: [
        { model: Image, as: 'previewImage', required: false },
        { model: Image, as: 'images', required: false }
      ]
    });

    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ================== ADMIN ==================

// Create new announcement
async function create(req, res) {
  try {
    const { titre, contenu, image_apercu_id } = req.body;

    const announcement = await Announcement.create({
      titre,
      contenu,
      statut: 'pending',
      date_creation: new Date(),
      image_apercu_id
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update announcement
async function update(req, res) {
  try {
    const { id } = req.params;
    const { titre, contenu, image_apercu_id } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    await announcement.update({ titre, contenu, image_apercu_id });
    res.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete announcement
async function remove(req, res) {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);

    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    await announcement.destroy();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Publish announcement
async function publish(req, res) {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    await announcement.update({ statut: 'publié', date_publication: new Date() });
    res.json(announcement);
  } catch (error) {
    console.error('Error publishing announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Archive announcement
async function archive(req, res) {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    await announcement.update({ statut: 'archivé' });
    res.json(announcement);
  } catch (error) {
    console.error('Error archiving announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all announcements for admin
async function getAllForAdmin(req, res) {
  try {
    const announcements = await Announcement.findAll({
      include: [{ model: Image, as: 'previewImage', required: false }],
      order: [['date_creation', 'DESC']]
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements for admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllPublished,
  getById,
  create,
  update,
  remove,
  publish,
  archive,
  getAllForAdmin
};
