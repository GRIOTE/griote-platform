const tagService = require('../services/tag.service');

exports.create = async (req, res) => {
  const { name } = req.body;
  const tag = await tagService.createTag(name);
  res.status(201).json(tag);
};

exports.list = async (req, res) => {
  const tags = await tagService.getAllTags();
  res.json(tags);
};

exports.update = async (req, res) => {
  const { tag_id } = req.params;
  try {
    console.log(1);
    const tag = await tagService.updateTag(tag_id, req.body);
    console.log(2);
    res.json(tag);
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
};
exports.delete = async (req, res) => {
  const { tag_id } = req.params;
  try {
    await tagService.deleteTag(tag_id);
    res.json({ ok: true });
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
};
