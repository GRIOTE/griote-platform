const { User, Depot, Document } = require('../models');

class StatsService {
  async getTotalUsers() {
    try {
      const count = await User.count();
      return { totalUsers: count };
    } catch (error) {
      throw new Error(`Failed to get total users: ${error.message}`);
    }
  }

  async getVerifiedUsers() {
    try {
      const count = await User.count({ where: { is_email_verified: true } });
      return { verifiedUsers: count };
    } catch (error) {
      throw new Error(`Failed to get verified users: ${error.message}`);
    }
  }

  async getTotalDepots() {
    try {
      const count = await Depot.count();
      return { totalDepots: count };
    } catch (error) {
      throw new Error(`Failed to get total depots: ${error.message}`);
    }
  }

  async getTotalDocuments() {
    try {
      const count = await Document.count();
      return { totalDocuments: count };
    } catch (error) {
      throw new Error(`Failed to get total documents: ${error.message}`);
    }
  }

}

module.exports = new StatsService();