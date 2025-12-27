class LogoutDTO {
  constructor({ refreshToken }) {
    this.refreshToken = refreshToken;
  }
}

module.exports = LogoutDTO;
