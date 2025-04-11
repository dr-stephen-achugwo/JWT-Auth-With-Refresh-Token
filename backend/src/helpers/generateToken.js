import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const generateAccessToken = (id) => {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "16h",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };
