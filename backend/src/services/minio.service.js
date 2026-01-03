// src/services/minio.service.js
const minioClient = require('../config/minio.config');
const logger = require('../config/logger.config');

/* ========================= HELPERS ========================= */

function getBucket() {
  return process.env.MINIO_BUCKET || 'griote';
}

function getPublicUrl() {
  return (
    process.env.MINIO_PUBLIC_URL ||
    `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`
  );
}

/* ========================= INITIALIZE ========================= */

async function initialize() {
  const bucket = getBucket();

  try {
    const exists = await minioClient.bucketExists(bucket);

    if (!exists) {
      await minioClient.makeBucket(bucket);
      logger.info(`Bucket créé : ${bucket}`);
    } else {
      logger.info(`Bucket déjà existant : ${bucket}`);
    }

    // Set bucket policy to allow public read access (toujours appliquer, même si bucket existe)
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucket}/*`
        }
      ]
    };

    await minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
    logger.info(`Politique publique appliquée au bucket : ${bucket}`);

    return true;
  } catch (err) {
    logger.error("Impossible d'initialiser MinIO", err);
    throw err;
  }
}

/* ========================= UPLOAD ========================= */

async function upload(file, prefix = '') {
  const bucket = getBucket();

  // Nettoyer le nom de fichier original (supprimer espaces et caractères spéciaux)
  const cleanOriginalName = file.originalname
    .replace(/\s+/g, '_') // Remplacer espaces par underscores
    .replace(/[^a-zA-Z0-9._-]/g, '') // Garder seulement lettres, chiffres, points, underscores, tirets
    .toLowerCase();

  const fileName =
    `${prefix ? prefix + '/' : ''}` +
    `${Date.now()}-${Math.round(Math.random() * 1e9)}-${cleanOriginalName}`;

  try {
    await minioClient.putObject(
      bucket,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    const publicUrl = getPublicUrl();
    return `${publicUrl}/${bucket}/${fileName}`;
  } catch (err) {
    logger.error('Erreur upload MinIO', err);
    throw err;
  }
}

/* ========================= UPLOAD FILE (ALIAS) ========================= */

async function uploadFile(file, prefix = '') {
  return upload(file, prefix);
}

/* ========================= DELETE ========================= */

async function deleteFile(url) {
  const bucket = getBucket();
  const publicUrl = getPublicUrl();
  const baseUrl = `${publicUrl}/${bucket}/`;

  if (!url.startsWith(baseUrl)) {
    throw new Error('Invalid URL');
  }

  const fileName = url.replace(baseUrl, '');

  try {
    await minioClient.removeObject(bucket, fileName);
    return true;
  } catch (err) {
    logger.error('Erreur suppression MinIO', err);
    throw err;
  }
}

module.exports = {
  initialize,
  upload,
  uploadFile,
  deleteFile
};
