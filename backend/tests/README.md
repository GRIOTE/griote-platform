# Backend Test Documentation

This document provides comprehensive information about the test suite for the Griote backend application.

## Overview

The test suite covers all backend functionalities with both unit and integration tests. Tests are organized by type and component for easy maintenance and execution.

## Test Structure

```
backend/tests/
├── fixtures/              # Test data fixtures
│   ├── users.fixture.js
│   ├── categories.fixture.js
│   ├── depots.fixture.js
│   └── tags.fixture.js
├── setup/                 # Test configuration and utilities
│   ├── testSetup.js       # Jest configuration
│   ├── mock.js           # Mock objects and utilities
│   ├── integrationSetup.js
│   ├── realIntegrationSetup.js
│   └── mock.js
├── unit/                  # Unit tests
│   ├── service/          # Service layer tests
│   │   ├── auth.service.test.js
│   │   ├── user.service.test.js
│   │   ├── mail.service.test.js
│   │   └── minio.service.test.js
│   ├── middleware/       # Middleware tests
│   │   ├── auth.middleware.test.js
│   │   ├── role.middleware.test.js
│   │   └── upload.middleware.test.js
│   ├── utils/            # Utility function tests
│   │   ├── password.util.test.js
│   │   └── token.util.test.js
│   ├── models/           # Model definition tests
│   │   └── user.model.test.js
│   ├── dtos/             # Data transfer object tests
│   │   └── register.dto.test.js
│   └── controller/       # Controller tests (existing)
│       ├── auth.controller.test.js
│       ├── user.controller.test.js
│       ├── category.controller.test.js
│       ├── depot.controller.test.js
│       ├── document.controller.test.js
│       └── tag.controller.test.js
└── integration/          # Integration tests
    ├── auth.integration.test.js
    ├── user.integration.test.js
    └── category.integration.test.js
```

## Test Categories

### Unit Tests

Unit tests focus on individual components in isolation, mocking external dependencies.

#### Services
- **auth.service.test.js**: Authentication service functions (register, login, token management)
- **user.service.test.js**: User management operations (CRUD, role management)
- **mail.service.test.js**: Email sending functionality (development vs production modes)
- **minio.service.test.js**: File storage operations (upload, bucket management)

#### Middleware
- **auth.middleware.test.js**: JWT token authentication
- **role.middleware.test.js**: Role-based access control
- **upload.middleware.test.js**: File upload configuration

#### Utilities
- **password.util.test.js**: Password hashing, validation, and comparison
- **token.util.test.js**: JWT token signing and verification

#### Models
- **user.model.test.js**: User model structure and constraints

#### DTOs
- **register.dto.test.js**: Registration data validation

### Integration Tests

Integration tests verify end-to-end functionality with real database and external services.

- **auth.integration.test.js**: Complete authentication flows (register → verify → login → refresh)
- **user.integration.test.js**: User management API endpoints
- **category.integration.test.js**: Category CRUD operations with role-based access

## Running Tests

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Ensure Docker and Docker Compose are installed and running

3. Set up environment variables for testing:
```bash
cp .env.example .env.test
# Configure test database and other services
```

4. Start test database with Docker Compose:
```bash
# From the backend directory
docker-compose -f compose.test.yaml up -d

# Or from the root directory
docker-compose -f backend/compose.test.yaml up -d

# The compose.test.yaml file contains PostgreSQL and Redis services
# configured specifically for testing
```

4. Set up test database schema and data:
```bash
npm run db:migrate:test
npm run db:seed:test
```

5. Stop test database when done:
```bash
# Stop the test database
docker-compose -f compose.test.yaml down

# Or stop and remove volumes (to clean up test data)
docker-compose -f compose.test.yaml down -v
```

### Test Commands

#### Quick Start with Docker
```bash
# Start test database
docker-compose -f compose.test.yaml up -d

# Run all tests
npm test

# Stop test database
docker-compose -f compose.test.yaml down
```

#### Individual Test Commands

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/unit/service/auth.service.test.js

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm test -- --verbose
```

### Test Configuration

Tests use Jest as the testing framework with the following configuration:

- **Setup**: `tests/setup/testSetup.js`
- **Environment**: Node.js with database isolation
- **Mocking**: External services and dependencies are mocked
- **Database**: Tests use a separate test database
- **Cleanup**: Automatic cleanup after each test

## Test Coverage

The test suite aims for comprehensive coverage of:

- **API Endpoints**: All routes and HTTP methods
- **Business Logic**: Service layer functions
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Error scenarios and edge cases
- **Security**: Authentication, authorization, and input validation
- **Integration**: End-to-end user workflows

### Coverage Goals

- **Unit Tests**: >90% code coverage
- **Integration Tests**: All critical user paths
- **Error Scenarios**: Common failure modes
- **Edge Cases**: Boundary conditions and unusual inputs

## Test Data

### Fixtures

Test fixtures provide consistent data for tests:

- **users.fixture.js**: User accounts with different roles
- **categories.fixture.js**: Depot categories
- **depots.fixture.js**: Sample depot entries
- **tags.fixture.js**: Tag definitions

### Mock Data

Mock objects simulate external dependencies:

- **mock.js**: HTTP request/response mocks
- **External Services**: Database, email, file storage mocks

## Best Practices

### Writing Tests

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use descriptive test names
3. **Independent Tests**: Each test should be self-contained
4. **Mock External Dependencies**: Isolate unit tests
5. **Real Integration**: Use real services for integration tests

### Test Organization

1. **Unit Tests**: Test individual functions/methods
2. **Integration Tests**: Test API endpoints and workflows
3. **Setup/Teardown**: Use beforeEach/afterEach for cleanup
4. **Descriptive Assertions**: Use meaningful assertion messages

### Code Quality

1. **DRY Principle**: Avoid test duplication
2. **Maintainable**: Easy to understand and modify
3. **Fast Execution**: Optimize for quick feedback
4. **Reliable**: Consistent test results

## Continuous Integration

Tests are designed to run in CI/CD pipelines:

- **Automated**: Run on every commit
- **Parallel**: Tests can run in parallel
- **Isolated**: No interference between test runs
- **Fast**: Quick feedback for developers

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure test database is available
2. **Environment Variables**: Check test environment configuration
3. **Mock Setup**: Verify mocks are properly configured
4. **Async Operations**: Ensure proper async/await usage

### Debug Mode

Run tests with debug output:
```bash
DEBUG=test npm test
```

### Test Isolation

If tests interfere with each other:
1. Check for shared state
2. Ensure proper cleanup
3. Use unique test data
4. Verify mock isolation

## Contributing

When adding new features:

1. **Write Tests First**: TDD approach
2. **Cover Edge Cases**: Include error scenarios
3. **Update Documentation**: Keep this README current
4. **Follow Patterns**: Maintain consistency with existing tests

## API Test Examples

### Authentication Flow
```javascript
// Register user
const registerResponse = await request(app)
  .post('/api/auth/register')
  .send(validUserData)
  .expect(201);

// Verify email
await request(app)
  .get('/api/auth/verify-email')
  .query({ token: registerResponse.body.emailToken })
  .expect(200);

// Login
const loginResponse = await request(app)
  .post('/api/auth/login')
  .send(loginCredentials)
  .expect(200);
```

### Protected Endpoints
```javascript
const response = await request(app)
  .get('/api/users/me')
  .set('Authorization', `Bearer ${accessToken}`)
  .expect(200);
```

This test suite ensures the backend is robust, secure, and maintainable. Regular test execution and coverage monitoring help maintain code quality throughout development.