const Joi = require('joi');

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

async function validateRequestPasswordReset(data) {
  const { error, value } = requestPasswordResetSchema.validate(data, { abortEarly: false });
  if (error) {
    throw new Error('Validation failed: ' + error.details.map(d => d.message).join(', '));
  }
  return value;
}

async function validateResetPassword(data) {
  const { error, value } = resetPasswordSchema.validate(data, { abortEarly: false });
  if (error) {
    throw new Error('Validation failed: ' + error.details.map(d => d.message).join(', '));
  }
  return value;
}

module.exports = {
  validateRequestPasswordReset,
  validateResetPassword,
};
