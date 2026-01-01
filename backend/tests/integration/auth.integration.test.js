// tests/integration/auth.integration.test.js
const request = require('supertest');
const app = require('../../src/app');
const { User, RefreshToken } = require('../../src/models');
const passwordUtil = require('../../src/utils/password.util');

describe('Auth - Real Integration Tests', () => {
  describe('POST /auth/register + POST /auth/login (Full Flow)', () => {
    it('devrait permettre inscription puis connexion complète', async () => {
      // 1. INSCRIPTION
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'SecurePass123!'
      };

      const registerResponse = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('emailToken');
      
      // Vérifier que l'utilisateur existe vraiment en base
      const userInDb = await User.findOne({ 
        where: { email: newUser.email } 
      });
      
      expect(userInDb).toBeDefined();
      expect(userInDb.first_name).toBe('John');
      expect(userInDb.last_name).toBe('Doe');
      expect(userInDb.is_email_verified).toBe(false);

      // 2. VÉRIFICATION EMAIL
      const verifyResponse = await request(app)
        .get('/auth/verify-email')
        .query({ token: registerResponse.body.emailToken })
        .expect(200);

      expect(verifyResponse.body.message).toBe('Email verified successfully');

      // Vérifier que le statut a changé en base
      await userInDb.reload();
      expect(userInDb.is_email_verified).toBe(true);

      // 3. CONNEXION
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('accessToken');
      expect(loginResponse.body).toHaveProperty('refreshToken');
      expect(loginResponse.body.user.email).toBe(newUser.email);

      // Vérifier que le refresh token existe en base
      const refreshTokenInDb = await RefreshToken.findOne({
        where: { user_id: userInDb.user_id }
      });
      
      expect(refreshTokenInDb).toBeDefined();
    }, 30000); // Timeout de 30 secondes

    it('devrait empêcher l\'inscription avec email existant', async () => {
      // Créer un premier utilisateur
      const hashedPassword = await passwordUtil.hashPassword('TestPass123!');
      
      await User.create({
        first_name: 'Existing',
        last_name: 'User',
        email: 'existing@test.com',
        password: hashedPassword,
        role: 'USER',
        is_email_verified: true
      });

      // Tenter de créer un second utilisateur avec le même email
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'existing@test.com',
          password: 'AnotherPass123!'
        })
        .expect(400);

      expect(response.body.message).toMatch(/email/i);

      // Vérifier qu'il n'y a qu'un seul utilisateur en base
      const count = await User.count({ where: { email: 'existing@test.com' } });
      expect(count).toBe(1);
    });
  });

  describe('POST /auth/refresh (Real Token Flow)', () => {
    it('devrait rafraîchir les tokens avec un vrai refresh token', async () => {
      // 1. Créer un utilisateur
      const hashedPassword = await passwordUtil.hashPassword('TestPass123!');
      
      await User.create({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@refresh.com',
        password: hashedPassword,
        role: 'USER',
        is_email_verified: true
      });

      // 2. Se connecter pour obtenir un refresh token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@refresh.com',
          password: 'TestPass123!'
        })
        .expect(200);

      const { refreshToken: oldRefreshToken } = loginResponse.body;

      // 3. Utiliser le refresh token
      const refreshResponse = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(200);

      expect(refreshResponse.body).toHaveProperty('accessToken');
      expect(refreshResponse.body).toHaveProperty('refreshToken');
      expect(refreshResponse.body.refreshToken).not.toBe(oldRefreshToken);

      // Vérifier que le nouveau token existe en base
      const newTokenInDb = await RefreshToken.findOne({
        where: { token: refreshResponse.body.refreshToken }
      });
      
      expect(newTokenInDb).toBeDefined();
    });
  });

  describe('PUT /auth/change-password (Real Password Flow)', () => {
    it('devrait changer le mot de passe et permettre connexion avec nouveau mot de passe', async () => {
      // 1. Créer et connecter un utilisateur
      const hashedPassword = await passwordUtil.hashPassword('OldPass123!');
      
      const user = await User.create({
        first_name: 'Change',
        last_name: 'Password',
        email: 'change@test.com',
        password: hashedPassword,
        role: 'USER',
        is_email_verified: true
      });

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'change@test.com',
          password: 'OldPass123!'
        })
        .expect(200);

      const { accessToken } = loginResponse.body;

      // 2. Changer le mot de passe
      await request(app)
        .put('/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          oldPassword: 'OldPass123!',
          newPassword: 'NewPass123!'
        })
        .expect(200);

      // 3. Vérifier que le mot de passe a changé en base
      await user.reload();
      const isNewPasswordValid = await passwordUtil.comparePassword(
        'NewPass123!',
        user.password
      );
      expect(isNewPasswordValid).toBe(true);

      // 4. Vérifier qu'on ne peut plus se connecter avec l'ancien mot de passe
      await request(app)
        .post('/auth/login')
        .send({
          email: 'change@test.com',
          password: 'OldPass123!'
        })
        .expect(400);

      // 5. Vérifier qu'on peut se connecter avec le nouveau
      const newLoginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'change@test.com',
          password: 'NewPass123!'
        })
        .expect(200);

      expect(newLoginResponse.body).toHaveProperty('accessToken');
    });
  });
});