const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function validateLogin(payload) {
  return loginSchema.validateAsync(payload, { abortEarly: false });
}

function loginDTO({ email, password }) {
  return { email, password };
}

module.exports = {
  validateLogin,
  loginDTO,
};
