const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refresh-token");

function generateRefreshToken(user) {
  return new RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Save in config?
  });
}

async function updateRefreshToken(oldToken) {
  const { user } = oldToken;
  const newToken = generateRefreshToken(user);
  oldToken.revoked = Date.now();
  oldToken.replacedByToken = newToken.token;
  await oldToken.save();
  await newToken.save();

  return newToken;
}

async function getRefreshToken(token) {
  const refreshToken = await RefreshToken.findOne({ token }).populate("user");
  if (!refreshToken || !refreshToken.isActive)
    throw new Error("Invalid refresh token");
  return refreshToken;
}

// TODO: Error handling
function generateJwt(user) {
  const exposedUser = exposedDetails(user);
  return jwt.sign({ exposedUser }, "super-secret-key", {
    expiresIn: "30s",
  });
}

function exposedDetails(user) {
  return {
    id: user.id,
    email: user.email,
  };
}

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

module.exports = {
  generateRefreshToken,
  getRefreshToken,
  updateRefreshToken,
  generateJwt,
};
