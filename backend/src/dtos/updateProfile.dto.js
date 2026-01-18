function updateProfileDTO({
  firstName,
  lastName,
  bio,
  linkedin_url,
  github_url,
  website_url,
  date_of_birth,
}) {
  return {
    firstName,
    lastName,
    bio,
    linkedin_url,
    github_url,
    website_url,
    date_of_birth,
  };
}

module.exports = updateProfileDTO;
