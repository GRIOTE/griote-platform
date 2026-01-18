const statsService = require('../services/stats.service');

module.exports = {
  getTotalUsers: async (req, res) => {
    try {
      const stats = await statsService.getTotalUsers();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getVerifiedUsers: async (req, res) => {
    try {
      const stats = await statsService.getVerifiedUsers();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getTotalDepots: async (req, res) => {
    try {
      const stats = await statsService.getTotalDepots();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getTotalDocuments: async (req, res) => {
    try {
      const stats = await statsService.getTotalDocuments();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};