const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { hashPassword, comparePassword, validatePasswordComplexity } = require('../utils/password.util');
const { signAccess, signRefresh, signEmail, verify } = require('../utils/token.util');
const mailService = require('./mail.service');
const userService = require('./user.service');
const logger = require('../config/logger.config');

async function registerUserWithEmailToken(payload) {
  const existingUser = await User.findOne({ where: { email: payload.email } });
  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  if (!validatePasswordComplexity(payload.password)) {
    throw new Error('Password does not meet complexity requirements');
  }

  const hashed = await hashPassword(payload.password);
  const user = await User.create({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    password_hash: hashed,
    role: payload.role || 'USER',
    is_email_verified: false,
    date_of_birth: payload.date_of_birth || null,
    bio: payload.bio || null,
    linkedin_url: payload.linkedin_url || null,
    github_url: payload.github_url || null,
    website_url: payload.website_url || null
  });

  const emailToken = signEmail({ id: user.user_id, email: user.email });
  await mailService.sendVerificationEmail(user.email, emailToken);
  return { user, emailToken };
}

async function verifyEmailToken(token) {
  const payload = verify(token);
  const user = await User.findByPk(payload.id);
  if (!user) throw new Error('User not found');
  user.is_email_verified = true;
  await user.save();
  return user;
}

async function resendVerificationEmail(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  if (user.is_email_verified) throw new Error('Email already verified');

  const emailToken = signEmail({ id: user.user_id, email: user.email });
  await mailService.sendVerificationEmail(user.email, emailToken);
  return true;
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    logger.warn('Login failed: user not found', { context: { email } });
    throw new Error('Invalid credentials');
  }
  if (!user.is_email_verified) {
    logger.warn('Login failed: email not verified', { context: { email } });
    throw new Error('Account not verified');
  }

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    logger.warn('Login failed: incorrect password', { context: { email } });
    throw new Error('Incorrect password');
  }

  const payload = { id: user.user_id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshTokenStr = signRefresh(payload);
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    token: refreshTokenStr,
    user_id: user.user_id,
    expires_at: expires
  });

  return { accessToken, refreshToken: refreshTokenStr, user };
}

async function refreshTokens(oldRefresh) {
  const dbToken = await RefreshToken.findOne({ where: { token: oldRefresh } });
  if (!dbToken) {
    logger.warn('Refresh failed: token not found', { context: { tokenPresent: !!oldRefresh } });
    throw new Error('Invalid refresh token');
  }

  let payload;
  try {
    payload = verify(oldRefresh);
  } catch (e) {
    logger.warn('Refresh failed: invalid JWT', { context: { error: e.message } });
    await dbToken.destroy();
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findByPk(payload.id);
  if (!user) {
    logger.warn('Refresh failed: user not found', { context: { userId: payload.id } });
    throw new Error('User not found');
  }

  const newAccess = signAccess({ id: payload.id, role: payload.role });
  const newRefresh = signRefresh({ id: payload.id, role: payload.role });

  await dbToken.update({
    token: newRefresh,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    accessToken: newAccess,
    refreshToken: newRefresh,
    user
  };
}

async function revokeRefresh(token) {
  await RefreshToken.destroy({ where: { token } });
}

async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  const token = signEmail({ user_id: user.user_id, type: 'PASSWORD_RESET' });
  await mailService.sendPasswordResetEmail(user.email, token);
  return true;
}

async function resetPassword(token, newPassword) {
  let payload;
  try {
    payload = verify(token);
  } catch {
    throw new Error('Invalid or expired token');
  }

  if (payload.type !== 'PASSWORD_RESET') throw new Error('Invalid token type');

  const user = await User.findByPk(payload.user_id);
  if (!user) throw new Error('User not found');

  if (!validatePasswordComplexity(newPassword)) {
    throw new Error('Password does not meet complexity requirements');
  }

  const hashed = await hashPassword(newPassword);
  user.password_hash = hashed;
  await user.save();
  return user;
}

async function changePassword(user_id, oldPassword, newPassword) {
  if (!validatePasswordComplexity(newPassword)) {
    throw new Error('Password does not meet complexity requirements');
  }

  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');

  const ok = await comparePassword(oldPassword, user.password_hash);
  if (!ok) throw new Error('Old password incorrect');

  const hashed = await hashPassword(newPassword);
  user.password_hash = hashed;
  await user.save();
  return true;
}

async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

module.exports = {
  registerUserWithEmailToken,
  verifyEmailToken,
  resendVerificationEmail,
  login,
  refreshTokens,
  revokeRefresh,
  requestPasswordReset,
  resetPassword,
  changePassword,
  findUserByEmail
};