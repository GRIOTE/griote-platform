const { Announcement, Image } = require('../models');
const minioService = require('./minio.service');

class AnnouncementService {
  // ---------- Utils ----------
  serialize(announcement) {
    const plain = announcement.toJSON();

    if (plain.previewImage) {
      plain.previewImage = {
        id: plain.previewImage.image_id,
        url: plain.previewImage.url,
        description: plain.previewImage.description
      };
    }

    if (plain.images) {
      plain.images = plain.images.map(img => ({
        id: img.image_id,
        url: img.url,
        description: img.description
      }));
    }

    return plain;
  }

  // ---------- Images ----------
  async uploadImage(file, description = 'Announcement image') {
    const url = await minioService.uploadFile(file, 'announcement-images');

    const image = await Image.create({
      url,
      description,
      imageable_type: 'announcement'
    });

    return image.toJSON();
  }

  async removeImage(imageId) {
    const image = await Image.findByPk(imageId);
    if (!image) return;
    await image.destroy();
  }

  // ---------- Public ----------
  async getAllPublished() {
    const announcements = await Announcement.findAll({
      where: { statut: 'published' },
      include: [{ model: Image, as: 'previewImage' }],
      order: [['date_publication', 'DESC']]
    });

    return announcements.map(a => this.serialize(a));
  }

  async getById(id) {
    const announcement = await Announcement.findByPk(id, {
      include: [
        { model: Image, as: 'previewImage' },
        { model: Image, as: 'images' }
      ]
    });

    return announcement ? this.serialize(announcement) : null;
  }

  // ---------- Admin ----------
  async create(data) {
    if (!data.titre || !data.contenu) {
      throw new Error('Title and content are required');
    }

    if (!data.author_id) {
      throw new Error('author_id is required');
    }

    // 🔥 CORRECTION ICI
    const announcement = await Announcement.create({
      titre: data.titre,
      contenu: data.contenu,
      statut: 'pending',
      author_id: data.author_id, // ✅ OBLIGATOIRE
      date_creation: new Date()
    });

    // Image preview
    if (data.image) {
      const uploaded = await this.uploadImage(data.image, 'Preview image');
      await this.attachPreviewImage(
        announcement.announcement_id,
        uploaded.id
      );
    } else if (data.image_apercu_id && !data.removePreview) {
      await this.attachPreviewImage(
        announcement.announcement_id,
        data.image_apercu_id
      );
    }

    return this.getById(announcement.announcement_id);
  }

  async update(id, data) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) throw new Error('Announcement not found');

    await announcement.update({
      titre: data.titre,
      contenu: data.contenu
    });

    if (data.removePreview && announcement.image_apercu_id) {
      await this.removeImage(announcement.image_apercu_id);
      await announcement.update({ image_apercu_id: null });
    }

    if (data.image) {
      const uploaded = await this.uploadImage(data.image, 'Preview image');
      await this.attachPreviewImage(id, uploaded.id);
    } else if (data.image_apercu_id && !data.removePreview) {
      await this.attachPreviewImage(id, data.image_apercu_id);
    }

    return this.getById(id);
  }

  async delete(id) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) throw new Error('Announcement not found');

    if (announcement.image_apercu_id) {
      await this.removeImage(announcement.image_apercu_id);
    }

    await announcement.destroy();
  }

  async publish(id) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) throw new Error('Announcement not found');

    await announcement.update({
      statut: 'published',
      date_publication: new Date()
    });

    return announcement;
  }

  async archive(id) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) throw new Error('Announcement not found');

    await announcement.update({ statut: 'archived' });
    return announcement;
  }

  async getAllForAdmin() {
    const announcements = await Announcement.findAll({
      include: [{ model: Image, as: 'previewImage' }],
      order: [['date_creation', 'DESC']]
    });

    return announcements.map(a => this.serialize(a));
  }

  // ---------- Relations ----------
  async attachPreviewImage(announcementId, imageId) {
    await Announcement.update(
      { image_apercu_id: imageId },
      { where: { announcement_id: announcementId } }
    );

    await Image.update(
      { imageable_id: announcementId },
      { where: { image_id: imageId } }
    );
  }
}

module.exports = new AnnouncementService();
