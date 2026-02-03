const authService = require('../services/auth.service');
const logger = require('../config/logger.config');

const { validateRegister, registerDTO } = require('../dtos/register.dto');
const { loginDTO } = require('../dtos/login.dto');
const refreshDTO = require('../dtos/refresh.dto');
const logoutDTO = require('../dtos/logout.dto');
const requestPasswordResetDTO = require('../dtos/requestPasswordReset.dto');
const resetPasswordDTO = require('../dtos/resetPassword.dto');
const changePasswordDTO = require('../dtos/changePassword.dto');

async function register(req, res) {
  try {
    await validateRegister(req.body);
    const dto = registerDTO(req.body);
    const { user, emailToken } = await authService.registerUserWithEmailToken(dto);
    logger.info('User registered', { context: { userId: user.user_id, email: user.email } });
    return res.status(201).json({
      message: 'User registered. Please verify your email.',
      emailToken
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({
        message: 'Validation error',
        details: err.details.map(d => ({ field: d.path.join('.'), message: d.message }))
      });
    }
    return res.status(400).json({ message: err.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const user = await authService.verifyEmailToken(token);
    if (!user) return res.status(400).json({ message: 'Invalid token or user not found' });
    logger.info('Email verified', { context: { userId: user.user_id, email: user.email } });
    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    await authService.resendVerificationEmail(email);
    logger.info('Verification email resent', { context: { email } });
    return res.json({ message: 'Verification email sent successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  let dto;
  try {
    dto = loginDTO(req.body);
    const { accessToken, refreshToken, user } = await authService.login(dto.email, dto.password);
    logger.info('User logged in', { context: { userId: user.user_id, email: user.email } });
    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.json({ accessToken, user, requiresInterfaceSelection: user.role === 'ADMIN' });
  } catch (err) {
    if (dto && err.message === 'Account not verified') {
      logger.warn('Login failed: email not verified', { context: { email: dto.email } });
      return res.status(400).json({ code: 'EMAIL_NOT_VERIFIED', message: 'Votre email n\'est pas encore vérifié' });
    }
    const email = dto ? dto.email : undefined;
    logger.warn('Login failed', { context: { email } });
    return res.status(400).json({ message: err.message });
  }
}

async function refreshToken(req, res) {
  try {
    const dto = refreshDTO({ refreshToken: req.cookies.rt || req.body.refreshToken || req.headers['x-refresh-token'] });
    if (!dto.refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
    const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshTokens(dto.refreshToken);
    res.cookie('rt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.json({ accessToken, user });
  } catch (err) {
    res.clearCookie('rt', { path: '/api/auth/refresh' });
    return res.status(401).json({ message: err.message || 'Invalid refresh token' });
  }
}

async function logout(req, res) {
  try {
    const dto = logoutDTO({ refreshToken: req.cookies.rt || req.body.refreshToken || req.headers['x-refresh-token'] });
    if (dto.refreshToken) await authService.revokeRefresh(dto.refreshToken);
    res.clearCookie('rt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/auth/refresh' });
    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const dto = requestPasswordResetDTO(req.body);
    await authService.requestPasswordReset(dto.email);
    logger.info('Password reset requested', { context: { email: dto.email } });
    return res.json({ message: 'Password reset email sent' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const dto = resetPasswordDTO(req.body);
    const user = await authService.resetPassword(dto.token, dto.newPassword);
    logger.info('Password reset', { context: { userId: user.user_id, email: user.email } });
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function changePassword(req, res) {
  try {
    const dto = changePasswordDTO(req.body);
    await authService.changePassword(req.user.user_id, dto.oldPassword, dto.newPassword);
    logger.info('Password changed', { context: { userId: req.user.user_id } });
    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  changePassword
};