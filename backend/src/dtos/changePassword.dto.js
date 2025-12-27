class ChangePasswordDTO {
  constructor({ oldPassword, newPassword }) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}

module.exports = ChangePasswordDTO;
