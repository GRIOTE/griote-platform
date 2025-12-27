// dtos/register.dto.js
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
    'any.only': 'Les mots de passe ne correspondent pas'
  }),
  role: Joi.string().valid('USER', 'ADMIN').default('USER'),
  // autres champs optionnels...
}).unknown(false); // interdit les champs non déclarés → plus propre

class RegisterDTO {
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'USER';
    this.dateOfBirth = data.date_of_birth;
    this.bio = data.bio;
    this.linkedinUrl = data.linkedin_url;
    this.githubUrl = data.github_url;
    this.websiteUrl = data.website_url;
  }
}

const validateRegister = (payload) => registerSchema.validateAsync(payload, { abortEarly: false });

module.exports = { validateRegister, RegisterDTO };