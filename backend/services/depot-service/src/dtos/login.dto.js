const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

class LoginDTO {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

module.exports = {
  validateLogin: (payload) => loginSchema.validateAsync(payload, { abortEarly: false }),
  LoginDTO,
};
