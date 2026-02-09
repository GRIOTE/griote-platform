const { Announcement, Image } = require('../models');
const minioService = require('./minio.service');

// ---------- Utils ----------
const serialize = (announcement) => {
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
};

// ---------- Images ----------
const uploadImage = async (file, description = 'Announcement image') => {
  const url = await minioService.uploadFile(file, 'announcement-images');

  const image = await Image.create({
    url,
    description,
    imageable_type: 'announcement'
  });

  return image.toJSON();
};

const removeImage = async (imageId) => {
  const image = await Image.findByPk(imageId);
  if (!image) return;
  await image.destroy();
};

// ---------- Relations ----------
const attachPreviewImage = async (announcementId, imageId) => {
  await Announcement.update(
    { image_apercu_id: imageId },
    { where: { announcement_id: announcementId } }
  );

  await Image.update(
    { imageable_id: announcementId },
    { where: { image_id: imageId } }
  );
};

// ---------- Public ----------
const getAllPublished = async () => {
  const announcements = await Announcement.findAll({
    where: { statut: 'published' },
    include: [{ model: Image, as: 'previewImage' }],
    order: [['date_publication', 'DESC']]
  });

  return announcements.map(serialize);
};

const getById = async (id) => {
  const announcement = await Announcement.findByPk(id, {
    include: [
      { model: Image, as: 'previewImage' },
      { model: Image, as: 'images' }
    ]
  });

  return announcement ? serialize(announcement) : null;
};

// ---------- Admin ----------
const create = async (data) => {
  if (!data.titre || !data.contenu) {
    throw new Error('Title and content are required');
  }

  if (!data.author_id) {
    throw new Error('author_id is required');
  }

  const imageApercuId = data.image_apercu_id
    ? parseInt(data.image_apercu_id, 10)
    : null;

  const announcement = await Announcement.create({
    titre: data.titre,
    contenu: data.contenu,
    statut: 'pending',
    author_id: data.author_id,
    date_creation: new Date()
  });

  if (data.image) {
    const uploaded = await uploadImage(data.image, 'Preview image');
    await attachPreviewImage(announcement.announcement_id, uploaded.image_id);
  } else if (imageApercuId) {
    await attachPreviewImage(announcement.announcement_id, imageApercuId);
  }

  return getById(announcement.announcement_id);
};

const update = async (id, data) => {
  const announcement = await Announcement.findByPk(id);
  if (!announcement) throw new Error('Announcement not found');

  await announcement.update({
    titre: data.titre,
    contenu: data.contenu
  });

  const imageApercuId = data.image_apercu_id
    ? parseInt(data.image_apercu_id, 10)
    : null;

  if (data.removePreview && announcement.image_apercu_id) {
    await removeImage(announcement.image_apercu_id);
    await announcement.update({ image_apercu_id: null });
  }

  if (data.image) {
    const uploaded = await uploadImage(data.image, 'Preview image');
    await attachPreviewImage(id, uploaded.id);
  } else if (imageApercuId) {
    await attachPreviewImage(id, imageApercuId);
  }

  return getById(id);
};

const remove = async (id) => {
  const announcement = await Announcement.findByPk(id);
  if (!announcement) throw new Error('Announcement not found');

  if (announcement.image_apercu_id) {
    await removeImage(announcement.image_apercu_id);
  }

  await announcement.destroy();
};

const publish = async (id) => {
  const announcement = await Announcement.findByPk(id);
  if (!announcement) throw new Error('Announcement not found');

  await announcement.update({
    statut: 'published',
    date_publication: new Date()
  });

  return announcement;
};

const archive = async (id) => {
  const announcement = await Announcement.findByPk(id);
  if (!announcement) throw new Error('Announcement not found');

  await announcement.update({ statut: 'archived' });
  return announcement;
};

const getAllForAdmin = async () => {
  const announcements = await Announcement.findAll({
    include: [{ model: Image, as: 'previewImage' }],
    order: [['date_creation', 'DESC']]
  });

  return announcements.map(serialize);
};

// ---------- Exports ----------
module.exports = {
  serialize,
  uploadImage,
  removeImage,
  attachPreviewImage,
  getAllPublished,
  getById,
  create,
  update,
  remove,
  publish,
  archive,
  getAllForAdmin
};
