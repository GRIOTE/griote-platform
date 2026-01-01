// tests/integration/user.integration.test.js
const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/models');
const passwordUtil = require('../../src/utils/password.util');

describe('User Management - Real Integration Tests', () => {
  let adminToken, userToken, testUser;

  beforeAll(async () => {
    // Create admin user for testing
    const hashedPassword = await passwordUtil.hashPassword('AdminPass123!');
    const admin = await User.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@test.com',
      password_hash: hashedPassword,
      role: 'ADMIN',
      is_email_verified: true
    });

    // Create regular user
    const userPassword = await passwordUtil.hashPassword('UserPass123!');
    testUser = await User.create({
      first_name: 'Test',
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

  describe('GET /api/users/me', () => {
    it('should return current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.user_id).toBe(testUser.user_id);
      expect(response.body.email).toBe('user@test.com');
      expect(response.body.first_name).toBe('Test');
      expect(response.body.last_name).toBe('User');
      expect(response.body).not.toHaveProperty('password_hash');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update current user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        bio: 'Updated bio'
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.first_name).toBe('Updated');
      expect(response.body.last_name).toBe('Name');
      expect(response.body.bio).toBe('Updated bio');

      // Verify in database
      await testUser.reload();
      expect(testUser.first_name).toBe('Updated');
      expect(testUser.last_name).toBe('Name');
    });
  });

  describe('DELETE /api/users/me', () => {
    it('should delete current user account', async () => {
      const response = await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.message).toBe('User deleted successfully');

      // Verify user is deleted
      const deletedUser = await User.findByPk(testUser.user_id);
      expect(deletedUser).toBeNull();
    });
  });

  describe('GET /api/users/admin/users', () => {
    it('should return paginated users list for admin', async () => {
      const response = await request(app)
        .get('/api/users/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should apply filters', async () => {
      const response = await request(app)
        .get('/api/users/admin/users?role=ADMIN&page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.users.every(user => user.role === 'ADMIN')).toBe(true);
    });
  });

  describe('GET /api/users/admin/users/:id', () => {
    it('should return specific user for admin', async () => {
      const response = await request(app)
        .get(`/api/users/admin/users/${testUser.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.user_id).toBe(testUser.user_id);
      expect(response.body.email).toBe('user@test.com');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/users/admin/users', () => {
    it('should create new admin user', async () => {
      const newAdminData = {
        email: 'newadmin@test.com',
        password: 'NewAdminPass123!',
        first_name: 'New',
        last_name: 'Admin'
      };

      const response = await request(app)
        .post('/api/users/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newAdminData)
        .expect(201);

      expect(response.body.email).toBe('newadmin@test.com');
      expect(response.body.first_name).toBe('New');
      expect(response.body.last_name).toBe('Admin');
      expect(response.body.role).toBe('ADMIN');
      expect(response.body).not.toHaveProperty('password_hash');

      // Verify in database
      const createdUser = await User.findOne({ where: { email: 'newadmin@test.com' } });
      expect(createdUser).toBeDefined();
      expect(createdUser.role).toBe('ADMIN');
    });
  });

  describe('PUT /api/users/admin/users/:id', () => {
    it('should update user', async () => {
      const updateData = {
        first_name: 'Updated',
        last_name: 'Admin',
        email: 'updatedadmin@test.com'
      };

      const userToUpdate = await User.findOne({ where: { email: 'newadmin@test.com' } });

      const response = await request(app)
        .put(`/api/users/admin/users/${userToUpdate.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.first_name).toBe('Updated');
      expect(response.body.last_name).toBe('Admin');
      expect(response.body.email).toBe('updatedadmin@test.com');
    });
  });

  describe('PATCH /api/users/admin/users/:id/role', () => {
    it('should update user role', async () => {
      const userToUpdate = await User.findOne({ where: { email: 'updatedadmin@test.com' } });

      const response = await request(app)
        .patch(`/api/users/admin/users/${userToUpdate.user_id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'USER' })
        .expect(200);

      expect(response.body.role).toBe('USER');

      // Verify in database
      await userToUpdate.reload();
      expect(userToUpdate.role).toBe('USER');
    });
  });

  describe('DELETE /api/users/admin/users/:id', () => {
    it('should delete user', async () => {
      const userToDelete = await User.findOne({ where: { email: 'updatedadmin@test.com' } });

      const response = await request(app)
        .delete(`/api/users/admin/users/${userToDelete.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('User deleted successfully');

      // Verify user is deleted
      const deletedUser = await User.findByPk(userToDelete.user_id);
      expect(deletedUser).toBeNull();
    });
  });
});