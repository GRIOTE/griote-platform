const { DepotTag } = require('../models');

exports.create = async (req, res) => {
  const { name } = req.body;
  const tag = await DepotTag.create({ name });
  res.status(201).json(tag);
};

exports.list = async (req, res) => {
  const tags = await DepotTag.findAll({ order: [['name', 'ASC']] });
  res.json(tags);
};

exports.update = async (req, res) => {
  const { tag_id } = req.params;
  const [n] = await DepotTag.update(req.body, { where: { tag_id } });
  if (!n) return res.status(404).json({ error: 'Not found' });
  res.json(await DepotTag.findByPk(tag_id));
};

exports.delete = async (req, res) => {
  const { tag_id } = req.params;
  const n = await DepotTag.destroy({ where: { tag_id } });
  n ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found' });
};