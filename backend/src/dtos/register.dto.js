const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required(),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Les mots de passe ne correspondent pas',
  }),
  role: Joi.string().valid('USER', 'ADMIN').default('USER'),
}).unknown(false);

async function validateRegister(payload) {
  return registerSchema.validateAsync(payload, { abortEarly: false });
}

function registerDTO(data) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    role: data.role || 'USER',
    dateOfBirth: data.date_of_birth,
    bio: data.bio,
    linkedinUrl: data.linkedin_url,
    githubUrl: data.github_url,
    websiteUrl: data.website_url,
  };
}

module.exports = {
  validateRegister,
  registerDTO,
};
