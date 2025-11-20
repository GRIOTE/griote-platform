const { DepotCategory } = require('../models');

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const cat = await DepotCategory.create({ name, description });
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.errors?.[0]?.message || err.message });
  }
};

exports.list = async (req, res) => {
  const cats = await DepotCategory.findAll({ order: [['name', 'ASC']] });
  res.json(cats);
};

exports.update = async (req, res) => {
  const { category_id } = req.params;
  const [n] = await DepotCategory.update(req.body, { where: { category_id } });
  if (!n) return res.status(404).json({ error: 'Not found' });
  const cat = await DepotCategory.findByPk(category_id);
  res.json(cat);
};

exports.delete = async (req, res) => {
  const { category_id } = req.params;
  const n = await DepotCategory.destroy({ where: { category_id } });
  n ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found' });
};