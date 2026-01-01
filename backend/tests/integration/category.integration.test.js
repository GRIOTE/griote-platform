// tests/integration/category.integration.test.js
const request = require('supertest');
const app = require('../../src/app');
const { User, DepotCategory } = require('../../src/models');
const passwordUtil = require('../../src/utils/password.util');

describe('Category Management - Real Integration Tests', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    // Create admin user
    const hashedPassword = await passwordUtil.hashPassword('AdminPass123!');
    await User.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@test.com',
      password_hash: hashedPassword,
      role: 'ADMIN',
      is_email_verified: true
    });

    // Create regular user
    const userPassword = await passwordUtil.hashPassword('UserPass123!');
    await User.create({
      first_name: 'Regular',
      last_name: 'User',
      email: 'user@test.com',
      password_hash: userPassword,
      role: 'USER',
      is_email_verified: true
    });

    // Login to get tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'AdminPass123!' });

    adminToken = adminLogin.body.accessToken;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'UserPass123!' });

    userToken = userLogin.body.accessToken;
  });

  describe('GET /api/categories', () => {
    it('should return all categories for authenticated users', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Should have default categories from fixtures
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('category_id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should return categories without authentication', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/categories', () => {
    it('should create new category for admin', async () => {
      const newCategory = {
        name: 'Test Category'
      };

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCategory)
        .expect(201);

      expect(response.body).toHaveProperty('category_id');
      expect(response.body.name).toBe('Test Category');

      // Verify in database
      const createdCategory = await DepotCategory.findByPk(response.body.category_id);
      expect(createdCategory).toBeDefined();
      expect(createdCategory.name).toBe('Test Category');
    });

    it('should reject category creation for non-admin', async () => {
      const newCategory = {
        name: 'Unauthorized Category'
      };

      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCategory)
        .expect(403);
    });

    it('should reject duplicate category names', async () => {
      const duplicateCategory = {
        name: 'Test Category' // Already created above
      };

      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateCategory)
        .expect(400);
    });
  });

  describe('PATCH /api/categories/:category_id', () => {
    let testCategory;

    beforeAll(async () => {
      testCategory = await DepotCategory.create({
        name: 'Category to Update'
      });
    });

    it('should update category for admin', async () => {
      const updateData = {
        name: 'Updated Category Name'
      };

      const response = await request(app)
        .patch(`/api/categories/${testCategory.category_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.category_id).toBe(testCategory.category_id);
      expect(response.body.name).toBe('Updated Category Name');

      // Verify in database
      await testCategory.reload();
      expect(testCategory.name).toBe('Updated Category Name');
    });

    it('should reject category update for non-admin', async () => {
      const updateData = {
        name: 'Unauthorized Update'
      };

      await request(app)
        .patch(`/api/categories/${testCategory.category_id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);
    });

    it('should return 404 for non-existent category', async () => {
      const updateData = {
        name: 'Non-existent Category'
      };

      await request(app)
        .patch('/api/categories/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/categories/:category_id', () => {
    let categoryToDelete;

    beforeAll(async () => {
      categoryToDelete = await DepotCategory.create({
        name: 'Category to Delete'
      });
    });

    it('should delete category for admin', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryToDelete.category_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toEqual({ ok: true });

      // Verify category is deleted
      const deletedCategory = await DepotCategory.findByPk(categoryToDelete.category_id);
      expect(deletedCategory).toBeNull();
    });

    it('should reject category deletion for non-admin', async () => {
      const tempCategory = await DepotCategory.create({
        name: 'Temp Category'
      });

      await request(app)
        .delete(`/api/categories/${tempCategory.category_id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      // Cleanup
      await tempCategory.destroy();
    });

    it('should return 404 for non-existent category', async () => {
      await request(app)
        .delete('/api/categories/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});