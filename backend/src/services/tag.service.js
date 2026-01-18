const { DepotTag } = require('../models');

async function createTag(name) {
  const tag = await DepotTag.create({ name });
  return tag;
}

async function getAllTags() {
  const tags = await DepotTag.findAll({ order: [['name', 'ASC']] });
  return tags;
}

async function updateTag(tagId, data) {
  const id = Number(tagId);
  const [affectedRows] = await DepotTag.update(data, { where: { tag_id: id } });
  if (affectedRows === 0) throw new Error('Tag not found');
  return await DepotTag.findByPk(tagId);
}

async function deleteTag(tagId) {
  const deletedRows = await DepotTag.destroy({ where: { tag_id: tagId } });
  if (deletedRows === 0) throw new Error('Tag not found');
  return true;
}

module.exports = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag
};