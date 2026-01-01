// src/services/mail.service.js
const nodemailer = require('nodemailer');
const logger = require('../config/logger.config');

const config = {
  host: process.env.MAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || '587', 10),
  secure: String(process.env.MAIL_SECURE || 'false').toLowerCase() === 'true',
  auth: {
    user: process.env.MAIL_USER || process.env.SMTP_USER || '',
    pass: process.env.MAIL_PASS || process.env.SMTP_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const hasCredentials = Boolean(config.auth.user && config.auth.pass);

let transporter = null;

if (hasCredentials) {
  transporter = nodemailer.createTransport(config);

  logger.info(
    `Email transporter configured → ${config.host}:${config.port} (secure: ${config.secure})`
  );

  transporter.verify((error) => {
    if (error) {
      logger.warn('SMTP connection failed at startup (will retry on each send)', {
        error: error.message,
      });
    } else {
      logger.info('SMTP connection successful – ready to send emails');
    }
  });
} else {
  logger.warn(
    'No SMTP credentials found → Development mode: emails will be logged only (no real send)'
  );
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email, token) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <h2 style="color:#0066cc;">Welcome to Griote Foundation!</h2>
    <p>Thank you for signing up.</p>
    <p>Please verify your email address by clicking the button below:</p>
    <p style="text-align:center; margin:30px 0;">
      <a href="${verificationLink}" style="background:#0066cc; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold;">
        Verify my email
      </a>
    </p>
    <p>Or copy-paste this link into your browser:</p>
    <p><strong>${verificationLink}</strong></p>
    <hr>
    <small>If you didn't create an account, you can ignore this email.</small>
  `;

  // Development mode – just log the link
  if (!transporter) {
    logger.info('VERIFICATION EMAIL (dev mode – not sent)', { to: email });
    logger.info(`Verification link → ${verificationLink}`);
    return true;
  }

  // Production – send with error handling
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'contact@griote.org',
      to: email,
      subject: 'Verify your email – Griote Foundation',
      html,
    });
    logger.info('Verification email sent successfully', { to: email });
    return true;
  } catch (err) {
    logger.warn('Failed to send verification email (registration continues anyway)', {
      to: email,
      error: err.message,
    });
    return true; // ✅ Still return true so registration continues
  }
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, token) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <h2 style="color:#cc6600;">Password reset request</h2>
    <p>You requested a password reset.</p>
    <p>Click the button below to set a new password:</p>
    <p style="text-align:center; margin:30px 0;">
      <a href="${resetLink}" style="background:#cc6600; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold;">
        Reset my password
      </a>
    </p>
    <p>Or copy-paste this link:</p>
    <p><strong>${resetLink}</strong></p>
    <p><em>This link expires in 1 hour.</em></p>
    <hr>
    <small>If you didn't request this, you can safely ignore this email.</small>
  `;

  if (!transporter) {
    logger.info('PASSWORD RESET EMAIL (dev mode – not sent)', { to: email });
    logger.info(`Reset link → ${resetLink}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Griote Foundation" <no-reply@griote.org>',
      to: email,
      subject: 'Reset your password – Griote Foundation',
      html,
    });
    logger.info('Password reset email sent successfully', { to: email });
    return true;
  } catch (err) {
    logger.warn('Failed to send password reset email (operation continues)', {
      to: email,
      error: err.message,
    });
    return true;
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  transporter,
};