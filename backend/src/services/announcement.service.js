const { Announcement, Image } = require('../models');

class AnnouncementService {
  async getAllPublished() {
    return await Announcement.findAll({
      where: { statut: 'publié' },
      include: [{
        model: Image,
        as: 'imageApercu',
        required: false
      }],
      order: [['date_publication', 'DESC']]
    });
  }

  async getById(id) {
    return await Announcement.findByPk(id, {
      include: [{
        model: Image,
        as: 'images',
        required: false
      }]
    });
  }

  async create(data) {
    const announcement = await Announcement.create(data);
    if (data.image_apercu_id) {
      await announcement.setImageApercu(data.image_apercu_id);
    }
    return announcement;
  }

  async update(id, data) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    await announcement.update(data);
    if (data.image_apercu_id !== undefined) {
      await announcement.setImageApercu(data.image_apercu_id);
    }
    return announcement;
  }

  async delete(id) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    await announcement.destroy();
    return true;
  }

  async publish(id) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    await announcement.update({
      statut: 'publié',
      date_publication: new Date()
    });
    return announcement;
  }

  async archive(id) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    await announcement.update({ statut: 'archivé' });
    return announcement;
  }

  async getAllForAdmin() {
    return await Announcement.findAll({
      include: [{
        model: Image,
        as: 'imageApercu',
        required: false
      }],
      order: [['date_creation', 'DESC']]
    });
  }
}

module.exports = new AnnouncementService();