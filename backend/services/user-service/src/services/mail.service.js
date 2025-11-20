const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Vérifier la configuration email (support SMTP_USER ou MAIL_USER)
const smtpUser = process.env.SMTP_USER || process.env.MAIL_USER;
const smtpPassword = process.env.SMTP_PASSWORD || process.env.MAIL_PASS;
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const hasEmailConfig = smtpUser && smtpPassword && 
                       smtpUser !== 'your.email@gmail.com' &&
                       smtpUser !== 'your-email@example.com';

let transporter = null;

if (hasEmailConfig) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure, // true pour 465, false pour 587
    auth: {
      user: smtpUser,
      pass: smtpPassword
    },
    tls: {
      rejectUnauthorized: false // Pour Hostinger
    }
  });
  logger.info(`Email transporter configured: ${smtpHost}:${smtpPort} (secure: ${smtpSecure})`);
} else {
  logger.warn('Email transporter NOT configured - emails will be logged only (dev mode)');
}

async function sendVerificationEmail(email, token) {
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `<h2>Bienvenue sur Griote Foundation !</h2>
    <p>Merci de vous être inscrit. Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
    <a href="${link}">Vérifier mon email</a>`;
  
  // En mode développement sans config email, juste logger
  if (!transporter) {
    logger.info('📧 [DEV MODE] Email de vérification (non envoyé):', { email, link });
    logger.info(`🔗 Lien de vérification: ${link}`);
    return;
  }
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Griote Foundation <contact@griote.org>',
    to: email,
    subject: 'Vérification de votre email - Griote Foundation',
    html
  });
  logger.info('Verification email sent', { email });
}

async function sendPasswordResetEmail(email, token) {
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `<h2>Réinitialisation de votre mot de passe</h2>
    <p>Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous :</p>
    <a href="${link}">Réinitialiser mon mot de passe</a>`;
  
  // En mode développement sans config email, juste logger
  if (!transporter) {
    logger.info('📧 [DEV MODE] Email de réinitialisation (non envoyé):', { email, link });
    logger.info(`🔗 Lien de réinitialisation: ${link}`);
    return;
  }
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Griote Foundation <contact@griote.org>',
    to: email,
    subject: 'Réinitialisation de mot de passe - Griote Foundation',
    html
  });
  logger.info('Password reset email sent', { email });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
