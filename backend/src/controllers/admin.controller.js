const adminService = require('../services/admin.service');

class AdminController {
  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, email, name } = req.query;
      const filters = { role, email, name };
      
      const result = await adminService.getAllUsers(page, limit, filters);
      res.json(result);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const user = await adminService.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Create new admin user
   */
  async createAdmin(req, res) {
    try {
      const adminData = req.body;
      const admin = await adminService.createAdmin(adminData);
      res.status(201).json(admin);
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      const user = await adminService.updateUserRole(userId, role);
      res.json(user);
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Update user information
   */
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      
      const user = await adminService.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await adminService.deleteUser(userId);
      res.json(result);
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(req, res) {
    try {
      const stats = await adminService.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error('Get platform stats error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Reset user password
   */
  async resetUserPassword(req, res) {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;
      
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      
      const result = await adminService.resetUserPassword(userId, newPassword);
      res.json(result);
    } catch (error) {
      console.error('Reset user password error:', error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AdminController();
