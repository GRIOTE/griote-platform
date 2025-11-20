const userService = require('../services/user.service');

async function getProfile(req, res) {
  try {
    const profile = await userService.getFullProfile(req.user.id);
    return res.json(profile);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const profile = await userService.updateFullProfile(req.user.id, req.body);
    return res.json(profile);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { getProfile, updateProfile };
