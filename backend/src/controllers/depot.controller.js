const depotService = require('../services/depot.service');

const createDepotController = async (req, res) => {
  try {
    const { title, description, category_id, tag_ids } = req.body;
    const depot = await depotService.createDepot({ title, description, category_id, tag_ids }, req.user.user_id);
    res.status(201).json(depot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepotController = async (req, res) => {
  try {
    const { id } = req.params;
    const depot = await depotService.getDepotById(id);
    res.json(depot);
  } catch (error) {
    if (error.message === 'Depot not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const listDepotsController = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.owner_id) filters.owner_id = req.query.owner_id;
    if (req.query.category_id) filters.category_id = req.query.category_id;
    const depots = await depotService.getAllDepots(filters);
    res.json(depots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDepotController = async (req, res) => {
  try {
    const { id } = req.params;
    const depot = await depotService.updateDepot(id, req.body);
    res.json(depot);
  } catch (error) {
    if (error.message === 'Depot not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const deleteDepotController = async (req, res) => {
  try {
    const { id } = req.params;
    await depotService.deleteDepot(id);
    res.json({ message: 'Depot deleted successfully' });
  } catch (error) {
    if (error.message === 'Depot not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const addDocumentController = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file provided' });
    const document = await depotService.addDocumentToDepot(id, { file }, req.user.user_id);
    res.status(201).json(document);
  } catch (error) {
    if (error.message === 'Depot not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const listDepotDocumentsController = async (req, res) => {
  try {
    const { id } = req.params;
    const documents = await depotService.getDepotDocuments(id);
    res.json(documents);
  } catch (error) {
    if (error.message === 'Depot not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  createDepotController,
  getDepotController,
  listDepotsController,
  updateDepotController,
  deleteDepotController,
  addDocumentController,
  listDepotDocumentsController
};