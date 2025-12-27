const authService = require('../services/auth.service');
const { RegisterDTO, validateRegister } = require('../dtos/register.dto');
const { LoginDTO } = require('../dtos/login.dto');
const RefreshDTO = require('../dtos/refresh.dto');
const LogoutDTO = require('../dtos/logout.dto');
const RequestPasswordResetDTO = require('../dtos/requestPasswordReset.dto');
const ResetPasswordDTO = require('../dtos/resetPassword.dto');
const ChangePasswordDTO = require('../dtos/changePassword.dto');

async function register(req, res) {
  try {
    await validateRegister(req.body);
    const dto = new RegisterDTO(req.body);
    const { user, emailToken } = await authService.registerUserWithEmailToken(dto);
    return res.status(201).json({ message: 'User registered. Please verify your email.', emailToken });
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
    await authService.verifyEmailToken(token);
    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    await authService.resendVerificationEmail(email);
    return res.json({ message: 'Verification email sent successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const dto = new LoginDTO(req.body);
    const { accessToken, refreshToken, user } = await authService.login(dto.email, dto.password);

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const response = {
      accessToken,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_email_verified: user.is_email_verified
      },
      requiresInterfaceSelection: user.role === 'ADMIN'
    };

    return res.json(response);
  } catch (err) {
    if (err.message === 'Account not verified') {
      return res.status(400).json({ code: 'EMAIL_NOT_VERIFIED', message: 'Votre email n\'est pas encore vérifié' });
    }
    return res.status(400).json({ message: err.message });
  }
}

async function refreshToken(req, res) {
  try {
    // On lit le cookie au lieu du body
    const oldRefreshToken = req.cookies.rt;
    if (!oldRefreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const tokens = await authService.refreshTokens(oldRefreshToken);

    res.cookie('rt', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken: tokens.accessToken });
  } catch (err) {
    res.clearCookie('rt', { path: '/auth/refresh' });
    return res.status(401).json({ message: err.message || 'Invalid refresh token' });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.rt || req.body.refreshToken || req.headers['x-refresh-token'];
    
    if (token) {
      await authService.revokeRefresh(token);
    }

    res.clearCookie('rt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh'
    });

    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const dto = new RequestPasswordResetDTO(req.body);
    await authService.requestPasswordReset(dto.email);
    return res.json({ message: 'Password reset email sent' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const dto = new ResetPasswordDTO(req.body);
    await authService.resetPassword(dto.token, dto.newPassword);
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function changePassword(req, res) {
  try {
    const dto = new ChangePasswordDTO(req.body);
    await authService.changePassword(req.user.id, dto.oldPassword, dto.newPassword);
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
