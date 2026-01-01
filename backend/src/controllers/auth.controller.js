const authService = require('../services/auth.service');
const logger = require('../config/logger.config');

const { validateRegister, registerDTO } = require('../dtos/register.dto');
const { loginDTO } = require('../dtos/login.dto');
const refreshDTO = require('../dtos/refresh.dto');
const logoutDTO = require('../dtos/logout.dto');
const requestPasswordResetDTO = require('../dtos/requestPasswordReset.dto');
const resetPasswordDTO = require('../dtos/resetPassword.dto');
const changePasswordDTO = require('../dtos/changePassword.dto');

/* ========================= REGISTER ========================= */

async function register(req, res) {
  try {
    await validateRegister(req.body);

    const dto = registerDTO(req.body);

    const { user, emailToken } =
      await authService.registerUserWithEmailToken(dto);

    return res.status(201).json({
      message: 'User registered. Please verify your email.',
      emailToken
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({
        message: 'Validation error',
        details: err.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }

    return res.status(400).json({ message: err.message });
  }
}

/* ========================= VERIFY EMAIL ========================= */

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    await authService.verifyEmailToken(token);
    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/* ========================= RESEND VERIFICATION ========================= */

async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    await authService.resendVerificationEmail(email);
    return res.json({ message: 'Verification email sent successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/* ========================= LOGIN ========================= */

async function login(req, res) {
  try {
    const dto = loginDTO(req.body);

    const { accessToken, refreshToken, user } =
      await authService.login(dto.email, dto.password);

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      accessToken,
      user,
      requiresInterfaceSelection: user.role === 'ADMIN'
    });
  } catch (err) {
    if (err.message === 'Account not verified') {
      return res.status(400).json({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Votre email n\'est pas encore vérifié'
      });
    }

    return res.status(400).json({ message: err.message });
  }
}

/* ========================= REFRESH TOKEN ========================= */

async function refreshToken(req, res) {
  try {
    const dto = refreshDTO({ refreshToken: req.cookies.rt });

    if (!dto.refreshToken) {
      logger.warn('No refresh token in cookie');
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    // ← Le service renvoie maintenant { accessToken, refreshToken, user }
    const { accessToken, refreshToken: newRefreshToken, user } = 
      await authService.refreshTokens(dto.refreshToken);

    res.cookie('rt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ← On renvoie accessToken + user
    return res.json({ 
      accessToken,
      user // ← ajouté ici
    });
  } catch (err) {
    res.clearCookie('rt', { path: '/api/auth/refresh' });
    return res.status(401).json({ message: err.message || 'Invalid refresh token' });
  }
}

/* ========================= LOGOUT ========================= */

async function logout(req, res) {
  try {
    const dto = logoutDTO({
      refreshToken:
        req.cookies.rt ||
        req.body.refreshToken ||
        req.headers['x-refresh-token']
    });

    if (dto.refreshToken) {
      await authService.revokeRefresh(dto.refreshToken);
    }

    res.clearCookie('rt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh'
    });

    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/* ========================= PASSWORD RESET ========================= */

async function requestPasswordReset(req, res) {
  try {
    const dto = requestPasswordResetDTO(req.body);
    await authService.requestPasswordReset(dto.email);
    return res.json({ message: 'Password reset email sent' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const dto = resetPasswordDTO(req.body);
    await authService.resetPassword(dto.token, dto.newPassword);
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/* ========================= CHANGE PASSWORD ========================= */

async function changePassword(req, res) {
  try {
    const dto = changePasswordDTO(req.body);
    await authService.changePassword(
      req.user.id,
      dto.oldPassword,
      dto.newPassword
    );

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
