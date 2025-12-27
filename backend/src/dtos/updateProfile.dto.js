class UpdateProfileDTO {
  constructor({ firstName, lastName, bio, linkedin_url, github_url, website_url, date_of_birth }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio;
    this.linkedin_url = linkedin_url;
    this.github_url = github_url;
    this.website_url = website_url;
    this.date_of_birth = date_of_birth;
  }
}

module.exports = UpdateProfileDTO;
