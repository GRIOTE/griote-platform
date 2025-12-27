// tests/setup/mock.js

/**
 * Crée un mock de requête Express
 */
const mockRequest = (overrides = {}) => {
  return {
    body: {},
    query: {},
    params: {},
    headers: {},
    user: null,
    file: null,
    files: null,
    ...overrides
  };
};

/**
 * Crée un mock de réponse Express
 */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Crée un mock de fonction next
 */
const mockNext = () => jest.fn();

/**
 * Mock d'un utilisateur
 */
const mockUser = (overrides = {}) => ({
  user_id: 1,
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  role: 'USER',
  is_email_verified: true,
  ...overrides
});

/**
 * Mock d'un token JWT
 */
const mockToken = {
  accessToken: 'mock.access.token',
  refreshToken: 'mock.refresh.token'
};

module.exports = {
  mockRequest,
  mockResponse,
  mockNext,
  mockUser,
  mockToken
};