// user service

const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { User, Image } = require('../models');
const minioService = require('./minio.service');
const logger = require('../config/logger.config');

/**
 * Get full profile of a user (safe)
 */
async function getFullProfile(user_id) {
  const user = await User.findByPk(user_id, {
    attributes: { exclude: ['password_hash'] },
    include: [
      {
        model: Image,
        as: 'images',
        where: { imageable_type: 'user' },
        required: false
      }
    ]
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get the latest profile picture (most recent image for this user)
  const latestImage = await Image.findOne({
    where: { imageable_type: 'user', imageable_id: user_id },
    order: [['created_at', 'DESC']]
  });

  // ✅ CORRECTION : Convertir en objet plain et ajouter profile_picture
  const userJson = user.toJSON();
  userJson.profile_picture = latestImage?.url || null;

  // Transform is_email_verified to email_verified for frontend compatibility
  userJson.email_verified = userJson.is_email_verified;
  delete userJson.is_email_verified;

  return userJson;
}

/**
 * Validate URL format
 */
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Update full profile (self)
 */
async function updateFullProfile(user_id, data) {
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  const {
    first_name,
    last_name,
    bio,
    linkedin_url,
    github_url,
    website_url,
    date_of_birth
  } = data;

  // Validate date_of_birth if provided
  if (date_of_birth !== undefined && date_of_birth !== null && date_of_birth !== '') {
    const dob = new Date(date_of_birth);
    if (isNaN(dob.getTime())) {
      throw new Error('Date de naissance invalide');
    }
    if (dob > new Date()) {
      throw new Error('La date de naissance ne peut pas être dans le futur');
    }
    // Check if person is at least 5 years old (reasonable minimum)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    if (dob < minDate) {
      throw new Error('Date de naissance invalide');
    }
    user.date_of_birth = date_of_birth;
  }

  // Validate URLs if provided
  if (linkedin_url !== undefined && linkedin_url !== null && linkedin_url.trim() !== '') {
    if (!isValidUrl(linkedin_url)) {
      throw new Error('URL LinkedIn invalide');
    }
    user.linkedin_url = linkedin_url;
  }
  
  if (github_url !== undefined && github_url !== null && github_url.trim() !== '') {
    if (!isValidUrl(github_url)) {
      throw new Error('URL GitHub invalide');
    }
    user.github_url = github_url;
  }
  
  if (website_url !== undefined && website_url !== null && website_url.trim() !== '') {
    if (!isValidUrl(website_url)) {
      throw new Error('URL du site web invalide');
    }
    user.website_url = website_url;
  }

  if (first_name !== undefined) user.first_name = first_name;
  if (last_name !== undefined) user.last_name = last_name;
  if (bio !== undefined) user.bio = bio;

  await user.save();

  return getFullProfile(user_id);
}

/**
 * Get user by ID (safe)
 */
async function getUserById(user_id) {
  const user = await User.findByPk(user_id, {
    attributes: { exclude: ['password_hash'] }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Transform is_email_verified to email_verified for frontend compatibility
  const userJson = user.toJSON();
  userJson.email_verified = userJson.is_email_verified;
  delete userJson.is_email_verified;
  return userJson;
}

/**
 * Delete user account (hard delete for now)
 */
async function deleteUser(user_id) {
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
  return { message: 'User deleted successfully' };
}

/**
 * Change password
 */
async function changePassword(user_id, oldPassword, newPassword) {
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  // Vérifier que l'ancien mot de passe est correct
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) {
    throw new Error('Ancien mot de passe incorrect');
  }

  // Hasher et mettre à jour le nouveau mot de passe
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await user.update({ password_hash: newPasswordHash });

  return { message: 'Mot de passe mis à jour avec succès' };
}

/**
 * Set or update profile picture
 */
async function setProfilePicture(user_id, file, description = 'Profile picture') {
  if (!file) throw new Error('Fichier manquant');

  // Supprimer l'ancienne image
  const oldImages = await Image.findAll({
    where: { imageable_type: 'user', imageable_id: user_id }
  });

  for (const img of oldImages) {
    await minioService.deleteFile(img.url);
    await img.destroy();
  }

  // Upload sur MinIO
  const url = await minioService.uploadFile(file, 'profile-pictures');

  // Créer l'entrée BDD
  const profileImage = await Image.create({
    url,
    description,
    imageable_type: 'user',
    imageable_id: user_id
  });

  // ✅ CORRECTION : Retourner l'objet avec l'URL
  return profileImage.toJSON();
}

async function removeProfilePicture(user_id) {
  const images = await Image.findAll({
    where: { imageable_type: 'user', imageable_id: user_id }
  });

  for (const img of images) {
    await minioService.deleteFile(img.url);
    await img.destroy();
  }

  return { message: 'Profile picture removed successfully' };
}

/* =====================================================
   ADMIN — opérations globales / gestion utilisateurs
   ===================================================== */

/**
 * Get all users with pagination & filters
 */
async function getAllUsers(page = 1, limit = 10, filters = {}) {
  const offset = (page - 1) * limit;
  const whereClause = {};

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
    limit: Number(limit),
    offset: Number(offset),
    order: [['created_at', 'DESC']],
    attributes: { exclude: ['password_hash'] }
  });

  // Transform is_email_verified to email_verified for frontend compatibility
  const users = rows.map(user => {
    const userJson = user.toJSON();
    userJson.email_verified = userJson.is_email_verified;
    delete userJson.is_email_verified;
    return userJson;
  });

  return {
    users,
    totalUsers: count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page)
  };
}

/**
 * Create a new admin user
 */
async function createAdmin(adminData) {
  const { email, password, first_name, last_name } = adminData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    logger.warn('Admin creation failed: email already exists', { context: { email } });
    throw new Error('User with this email already exists');
  }

  const password_hash = await bcrypt.hash(password, 10);

  const admin = await User.create({
    email,
    password_hash,
    first_name,
    last_name,
    role: 'ADMIN',
    is_email_verified: true
  });

  // Transform is_email_verified to email_verified for frontend compatibility
  const { password_hash: _, ...adminWithoutPassword } = admin.toJSON();
  adminWithoutPassword.email_verified = adminWithoutPassword.is_email_verified;
  delete adminWithoutPassword.is_email_verified;
  return adminWithoutPassword;
}

/**
 * Update user role (ADMIN only)
 */
async function updateUserRole(user_id, newRole) {
  const validRoles = ['USER', 'ADMIN'];
  if (!validRoles.includes(newRole)) {
    logger.warn('Role update failed: invalid role', { context: { userId: user_id, role: newRole } });
    throw new Error('Invalid role specified');
  }

  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = newRole;
  await user.save();

  // Transform is_email_verified to email_verified for frontend compatibility
  const userWithoutPassword = user.toJSON();
  userWithoutPassword.email_verified = userWithoutPassword.is_email_verified;
  delete userWithoutPassword.is_email_verified;
  return userWithoutPassword;
}

/**
 * Update user (admin edit)
 */
async function updateUser(user_id, updateData) {
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  const allowedFields = [
    'first_name',
    'last_name',
    'email',
    'date_of_birth',
    'bio',
    'linkedin_url',
    'github_url',
    'website_url',
    'role',
    'is_email_verified'
  ];

  const filteredData = {};
  for (const key of Object.keys(updateData)) {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  }

  if (filteredData.email && filteredData.email !== user.email) {
    const existingUser = await User.findOne({
      where: {
        email: filteredData.email,
        user_id: { [Op.ne]: user_id }
      }
    });

    if (existingUser) {
      logger.warn('User update failed: email already in use', { context: { userId, email: filteredData.email } });
      throw new Error('Email already in use');
    }
  }

  await user.update(filteredData);

  // Transform is_email_verified to email_verified for frontend compatibility
  const userWithoutPassword = user.toJSON();
  userWithoutPassword.email_verified = userWithoutPassword.is_email_verified;
  delete userWithoutPassword.is_email_verified;
  return userWithoutPassword;
}

module.exports = {
  // user
  getFullProfile,
  updateFullProfile,
  getUserById,
  deleteUser,
  changePassword,
  setProfilePicture,
  removeProfilePicture,

  // admin
  getAllUsers,
  createAdmin,
  updateUserRole,
  updateUser
};