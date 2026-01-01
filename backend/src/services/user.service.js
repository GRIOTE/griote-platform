const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { User, Image } = require('../models');
const minioService = require('./minio.service');



/**
 * Get full profile of a user (safe)
 */
async function getFullProfile(user_id) {
  const user = await User.findByPk(user_id, {
    attributes: { exclude: ['password_hash'] },
    include: [
      {
        model: Image,
        as: 'profilePicture',
        required: false
      },
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

  return user;
}

/**
 * Update full profile (self)
 */
async function updateFullProfile(user_id, data) {
  console.log('updateFullProfile called with data:', data);
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

  console.log('Before update:', { first_name: user.first_name, last_name: user.last_name, bio: user.bio });
  if (first_name !== undefined) user.first_name = first_name;
  if (last_name !== undefined) user.last_name = last_name;
  if (bio !== undefined) user.bio = bio;
  if (linkedin_url !== undefined) user.linkedin_url = linkedin_url;
  if (github_url !== undefined) user.github_url = github_url;
  if (website_url !== undefined) user.website_url = website_url;
  if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;

  await user.save();
  console.log('After update:', { first_name: user.first_name, last_name: user.last_name, bio: user.bio });

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

  return user;
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
 * 
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

  // Supprimer l’ancienne image
  const oldImages = await Image.findAll({
    where: { imageable_type: 'user', imageable_id: user_id }
  });
  for (const img of oldImages) {
    await minioService.deleteFile(img.url);
    await img.destroy();
  }

  // Upload sur MinIO
  const url = await minioService.uploadFile(file, 'profile-pictures');

  // Créer l’entrée BDD
  const profileImage = await Image.create({
    url,
    description,
    imageable_type: 'user',
    imageable_id: user_id
  });

  return profileImage;
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

  return {
    users: rows,
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

  const { password_hash: _, ...adminWithoutPassword } = admin.toJSON();
  return adminWithoutPassword;
}

/**
 * Update user role (ADMIN only)
 */
async function updateUserRole(user_id, newRole) {
  const validRoles = ['USER', 'ADMIN'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role specified');
  }

  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = newRole;
  await user.save();

  const { password_hash: _, ...userWithoutPassword } = user.toJSON();
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
      throw new Error('Email already in use');
    }
  }

  await user.update(filteredData);

  const { password_hash: _, ...userWithoutPassword } = user.toJSON();
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

