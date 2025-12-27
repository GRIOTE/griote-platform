// tests/fixtures/users.fixture.js

const validUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'SecurePass123!'
};

const adminUser = {
  user_id: 1,
  first_name: 'Admin',
  last_name: 'User',
  email: 'admin@example.com',
  role: 'ADMIN',
  is_email_verified: true
};

const regularUser = {
  user_id: 2,
  first_name: 'Regular',
  last_name: 'User',
  email: 'user@example.com',
  role: 'USER',
  is_email_verified: true
};

const unverifiedUser = {
  user_id: 3,
  first_name: 'Unverified',
  last_name: 'User',
  email: 'unverified@example.com',
  role: 'USER',
  is_email_verified: false
};

module.exports = {
  validUser,
  adminUser,
  regularUser,
  unverifiedUser
};