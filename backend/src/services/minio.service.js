// src/services/minio.service.js
const minioClient = require('../config/minio.config');
const logger = require('../config/logger.config');

class MinioService {
  constructor(client = minioClient) {
    this.client = client;
    this.bucket = process.env.MINIO_BUCKET || 'griote';
  }

  async initialize() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        logger.info(`Bucket créé : ${this.bucket}`);
      } else {
        logger.info(`Bucket déjà existant : ${this.bucket}`);
      }
    } catch (err) {
      logger.error('Impossible d\'initialiser MinIO', err);
      throw err; 
    }
  }

  async upload(file, prefix = '') {
    const fileName = `${prefix ? prefix + '/' : ''}${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    
    await this.client.putObject(this.bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype
    });

    return `${process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`}/${this.bucket}/${fileName}`;
  }
}

module.exports = new MinioService();