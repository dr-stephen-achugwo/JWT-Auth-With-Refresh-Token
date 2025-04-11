import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/generateToken.js";
import jwt from "jsonwebtoken";
import { decryptJWT, encryptJWT } from "../helpers/encrypt.js";
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length <= 6) {
      return res.status(400).json({
        message: "Password must be at least 6 or more characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // const { password: passwordHash, ...userData } = response.toObject();

    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error, "error failed to register");
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (password.length <= 6) {
      return res.status(400).json({
        message: "Password must be at least 6 or more characters long",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const accessToken = generateAccessToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);

    const encryptedAccessToken = encryptJWT(accessToken);
    const encryptedRefreshToken = encryptJWT(refreshToken);

    const refreshTokenExists = await RefreshToken.findOne({
      userId: userExists._id,
    });

    if (refreshTokenExists) {
      await refreshTokenExists.updateOne({
        refreshToken: encryptedRefreshToken,
      });
    } else {
      await RefreshToken.create({
        userId: userExists._id,
        refreshToken: encryptedRefreshToken,
      });
    }

    console.log("Refresh Token sent to client:", refreshToken);

    res.cookie("accessToken", encryptedAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 16 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", encryptedRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successfully",
    });
  } catch (error) {
    console.log(error, "error failed to login");
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const refreshToken = async (req, res) => {
  const { REFRESH_TOKEN_SECRET } = process.env;
  try {
    // const authHeader = req.headers.authorization;
    // const refreshToken =
    //   authHeader?.startsWith("Bearer") && authHeader.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    const decryptRefreshToken = decryptJWT(refreshToken);

    if (!decryptRefreshToken) {
      return res.status(401).json({
        message: "Unauthorized | You are not logged in and Token is not exists",
      });
    }

    // is verify token valid in cookie?
    jwt.verify(
      decryptRefreshToken,
      REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Unauthorized | Refresh Token not found",
          });
        }

        const storedRefreshToken = await RefreshToken.findOne({
          userId: decoded.id,
        });

        if (!storedRefreshToken) {
          return res.status(401).json({
            message: "Unauthorized | Refresh Token not found",
          });
        }

        const decryptDatabaseRefreshToken = decryptJWT(
          storedRefreshToken.refreshToken
        );

        if (decryptDatabaseRefreshToken !== decryptRefreshToken) {
          return res.status(401).json({
            message: "Unauthorized | Refresh Token is not valid",
          });
        }

        const newAccessToken = generateAccessToken(storedRefreshToken.userId);
        const encryptedNewAccessToken = encryptJWT(newAccessToken);

        res.cookie("accessToken", encryptedNewAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 2 * 60 * 1000,
          path: "/",
        });

        res.json({ accessToken: encryptedNewAccessToken });
      }
    );
  } catch (error) {
    console.log(error, "error failed to refresh token");
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized | You are not logged in and Token is not exists",
      });
    }

    const checkRefreshToken = await User.findOne({ refreshToken });

    if (!checkRefreshToken) {
      return res.status(401).json({
        message: "Unauthorized | User not found and Token is not valid",
      });
    }

    await res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    await res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error, "error failed to logout");
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const me = async (req, res) => {
  try {
    const { _id } = req.user;
    const response = await User.findById(_id).select("-password");

    res.status(200).json({
      user: response,
    });
  } catch (error) {
    console.log(error, "error failed to get user");
    return res.status(500).json({ message: "Failed to get data users" });
  }
};
