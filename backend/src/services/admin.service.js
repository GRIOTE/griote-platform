const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class AdminService {
  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (filters.role) {
      whereClause.role = filters.role;
    }
    if (filters.email) {
      whereClause.email = { [Op.iLike]: `%${filters.email}%` };
    }
    if (filters.name) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${filters.name}%` } },
        { last_name: { [Op.iLike]: `%${filters.name}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash'] }
    });

    return {
      users: rows,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Create a new admin user
   */
  async createAdmin(adminData) {
    const { email, password, first_name, last_name } = adminData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const admin = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      role: 'ADMIN',
      is_email_verified: true // Admins are pre-verified
    });

    // Return admin without password
    const { password_hash: _, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  }

  /**
   * Update user role
   */
  async updateUserRole(userId, newRole) {
    const validRoles = ['USER', 'ADMIN'];
    
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role specified. Valid roles are: USER, ADMIN');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = newRole;
    await user.save();

    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  /**
   * Update user information
   */
  async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Fields that can be updated by admin
    const allowedFields = [
      'first_name', 'last_name', 'email', 'date_of_birth', 
      'bio', 'linkedin_url', 'github_url', 'website_url', 
      'role', 'is_email_verified'
    ];

    // Filter update data to only allowed fields
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // If email is being updated, check for uniqueness
    if (filteredData.email && filteredData.email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: filteredData.email,
          user_id: { [Op.ne]: userId }
        } 
      });
      if (existingUser) {
        throw new Error('Email already in use by another user');
      }
    }

    await user.update(filteredData);
    
    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  /**
   * Delete user (soft delete by deactivating)
   */
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // For now, we'll actually delete the user
    // In production, you might want to implement soft delete
    await user.destroy();
    
    return { message: 'User deleted successfully' };
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    const totalUsers = await User.count();
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']
      ],
      group: ['role']
    });

    const verifiedUsers = await User.count({
      where: { is_email_verified: true }
    });

    const recentUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    return {
      totalUsers,
      verifiedUsers,
      recentUsers,
      usersByRole: usersByRole.map(item => ({
        role: item.role,
        count: parseInt(item.dataValues.count)
      }))
    };
  }

  /**
   * Reset user password (admin function)
   */
  async resetUserPassword(userId, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    await user.update({ password_hash });
    
    return { message: 'Password reset successfully' };
  }
}

module.exports = new AdminService();
