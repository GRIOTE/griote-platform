class ResetPasswordDTO {
  constructor({ token, newPassword }) {
    this.token = token;
    this.newPassword = newPassword;
  }
}

module.exports = ResetPasswordDTO;
