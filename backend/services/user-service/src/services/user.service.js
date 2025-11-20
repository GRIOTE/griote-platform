const User = require('../models/user.model');

async function getFullProfile(userId) {
  const user = await User.findByPk(userId, { raw: true });
  if (!user) throw new Error('User not found');
  return user;
}

async function updateFullProfile(userId, data) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  const { firstName, lastName, bio, linkedin_url, github_url, website_url, date_of_birth } = data;
  if (firstName) user.first_name = firstName;
  if (lastName) user.last_name = lastName;
  if (bio !== undefined) user.bio = bio;
  if (linkedin_url !== undefined) user.linkedin_url = linkedin_url;
  if (github_url !== undefined) user.github_url = github_url;
  if (website_url !== undefined) user.website_url = website_url;
  if (date_of_birth) user.date_of_birth = date_of_birth;
  await user.save();
  return getFullProfile(userId);
}

module.exports = { getFullProfile, updateFullProfile };
