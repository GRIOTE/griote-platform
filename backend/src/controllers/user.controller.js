const userService = require('../services/user.service');
const { User, Image } = require('../models');
const logger = require('../config/logger.config');

async function getProfile(req, res) {
  try {
    const profile = await userService.getFullProfile(req.user.id);
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const updatedProfile = await userService.updateFullProfile(
      req.user.id,
      req.body
    );
    logger.info('Profile updated', { context: { userId: req.user.id } });
    return res.status(200).json(updatedProfile);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function deleteMyAccount(req, res) {
  try {
    const result = await userService.deleteUser(req.user.id);
    logger.info('Account deleted', { context: { userId: req.user.id } });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

async function setProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fichier manquant' });
    }

    const { description } = req.body;

    const profileImage = await userService.setProfilePicture(
      req.user.id,
      req.file,
      description
    );

    return res.status(201).json(profileImage);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/**
 * Delete profile picture
 * DELETE /api/users/me/profile-picture
 */
async function removeProfilePicture(req, res) {
  try {
    const result = await userService.removeProfilePicture(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Change user password
 * POST /api/users/me/change-password
 */
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
    }

    const result = await userService.changePassword(
      req.user.id, // toujours l’utilisateur connecté
      oldPassword,
      newPassword
    );

    logger.info('Password changed', { context: { userId: req.user.id } });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/* ========================= ADMIN CONTROLLER ========================= */

async function getAllUsers(req, res) {
  try {
    const { page, limit, role, email, name } = req.query;
    const users = await userService.getAllUsers(page, limit, { role, email, name });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

async function createAdmin(req, res) {
  try {
    const admin = await userService.createAdmin(req.body);
    logger.info('Admin created', { context: { adminId: req.user.id, newAdminId: admin.user_id } });
    return res.status(201).json(admin);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const updatedUser = await userService.updateUserRole(req.params.id, role);
    logger.info('User role updated', { context: { adminId: req.user.id, userId: req.params.id, newRole: role } });
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const result = await userService.deleteUser(req.params.id);
    logger.info('User deleted', { context: { adminId: req.user.id, userId: req.params.id } });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

/* ========================= STATS ========================= */

async function getTotalUsers(req, res) {
  try {
    const count = await User.count();
    return res.json({ totalUsers: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getVerifiedUsers(req, res) {
  try {
    const count = await User.count({ where: { is_email_verified: true } });
    return res.json({ verifiedUsers: count });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  // user
  getProfile,
  updateProfile,
  deleteMyAccount,
  setProfilePicture,
  removeProfilePicture,
  changePassword,

  // admin
  getAllUsers,
  getUserById,
  createAdmin,
  updateUserRole,
  updateUser,
  deleteUser,

  // stats
  getTotalUsers,
  getVerifiedUsers
};
