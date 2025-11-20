const minioClient = require('../config/minio.config');
const { v4: uuidv4 } = require('uuid');

class MinioService {
  async init() {
    const bucket = process.env.MINIO_BUCKET;
    if (!await minioClient.bucketExists(bucket)) {
      await minioClient.makeBucket(bucket);
    }
  }

  async upload(file, prefix = '') {
    const bucket = process.env.MINIO_BUCKET;
    const name = `${prefix}/${uuidv4()}-${file.originalname}`;
    await minioClient.putObject(bucket, name, file.buffer);
    return `http://${process.env.MINIO_ENDPOINT}:9000/${bucket}/${name}`;
  }
}

module.exports = new MinioService();