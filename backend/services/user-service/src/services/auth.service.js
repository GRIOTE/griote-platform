const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { hashPassword, comparePassword, validatePasswordComplexity } = require('../utils/password.util');
const { signAccess, signRefresh, signEmail, verify } = require('../utils/token.util');
const mailService = require('./mail.service');
const rabbit = require('../events/rabbitmq.publisher');
const logger = require('../config/logger');

async function registerUserWithEmailToken(payload) {
  // Vérifier si l'email existe déjà
  const existingUser = await User.findOne({ where: { email: payload.email } });
  if (existingUser) {
    throw new Error('Un compte avec cet email existe déjà');
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
  
  logger.info('User created', { userId: user.user_id, email: user.email });
  rabbit.publishUserCreated({
    event: 'UserCreated',
    data: { id: user.user_id, email: user.email, role: user.role }
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

async function login(email, password) {
  logger.debug('Login attempt for:', email);
  const user = await User.findOne({ where: { email } });
  if (!user) {
    logger.warn('Login attempt with non-existent email:', email);
    throw new Error('Invalid credentials');
  }
  if (!user.is_email_verified) {
    logger.warn('Login attempt with unverified account:', email);
    throw new Error('Account not verified');
  }
  logger.debug('Password comparison for:', email);
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    logger.warn('Incorrect password for:', email);
    throw new Error('Incorrect password');
  }
  logger.info('Successful login for:', email);
  const payload = { id: user.user_id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshTokenStr = signRefresh(payload);
  const expires = new Date(Date.now() + (7*24*60*60*1000)); // 7d
  await RefreshToken.create({ token: refreshTokenStr, userId: user.user_id, expiresAt: expires });
  return { accessToken, refreshToken: refreshTokenStr, user };
}

async function refreshTokens(oldRefresh) {
  const dbToken = await RefreshToken.findOne({ where: { token: oldRefresh } });
  if (!dbToken) throw new Error('Invalid refresh token');
  let payload;
  try { payload = verify(oldRefresh); }
  catch (e) { await dbToken.destroy(); throw new Error('Invalid or expired refresh token'); }
  const newAccess = signAccess({ id: payload.id, role: payload.role });
  const newRefresh = signRefresh({ id: payload.id, role: payload.role });
  await dbToken.update({ token: newRefresh, expiresAt: new Date(Date.now() + (7*24*60*60*1000)) });
  return { accessToken: newAccess, refreshToken: newRefresh };
}

async function revokeRefresh(token) {
  await RefreshToken.destroy({ where: { token } });
}

async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  const token = signEmail({ userId: user.user_id, type: 'PASSWORD_RESET' });
  await mailService.sendPasswordResetEmail(user.email, token);
  return true;
}

async function resetPassword(token, newPassword) {
  if (!validatePasswordComplexity(newPassword)) {
    throw new Error('Password does not meet complexity requirements');
  }
  let payload;
  try {
    payload = verify(token);
  } catch {
    throw new Error('Invalid or expired token');
  }
  if (payload.type !== 'PASSWORD_RESET') throw new Error('Invalid token type');
  const user = await User.findByPk(payload.userId);
  if (!user) throw new Error('User not found');
  const hashed = await hashPassword(newPassword);
  user.password_hash = hashed;
  await user.save();
  return true;
}

async function changePassword(email, oldPassword, newPassword) {
  if (!validatePasswordComplexity(newPassword)) {
    throw new Error('Password does not meet complexity requirements');
  }
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  const ok = await comparePassword(oldPassword, user.password_hash);
  if (!ok) throw new Error('Old password incorrect');
  const hashed = await hashPassword(newPassword);
  user.password_hash = hashed;
  await user.save();
  return true;
}

async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    logger.error('Error finding user by email:', error);
    throw new Error('Error finding user');
  }
}

module.exports = {
  registerUserWithEmailToken,
  verifyEmailToken,
  login,
  refreshTokens,
  revokeRefresh,
  requestPasswordReset,
  resetPassword,
  changePassword,
  findUserByEmail
};
