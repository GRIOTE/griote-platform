const Joi = require('joi');

// Validation du payload d'inscription
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .message('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)')
    .required(),
  role: Joi.string().valid('USER', 'ADMIN').optional().default('USER'),
  date_of_birth: Joi.date().optional(),
  bio: Joi.string().max(1000).optional(),
  linkedin_url: Joi.string().uri().optional(),
  github_url: Joi.string().uri().optional(),
  website_url: Joi.string().uri().optional(),
});

class RegisterDTO {
  constructor({ firstName, lastName, email, password, role, date_of_birth, bio, linkedin_url, github_url, website_url }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role || 'USER';
    this.date_of_birth = date_of_birth;
    this.bio = bio;
    this.linkedin_url = linkedin_url;
    this.github_url = github_url;
    this.website_url = website_url;
  }
}

module.exports = {
  validateRegister: (payload) => registerSchema.validateAsync(payload, { abortEarly: false }),
  RegisterDTO,
};
