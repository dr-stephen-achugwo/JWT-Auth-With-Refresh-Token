import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { decryptJWT } from "../helpers/encrypt.js";

export const authMiddleware = async (req, res, next) => {
  const { ACCESS_TOKEN_SECRET } = process.env;
  try {
    // const authHeader = req.headers.authorization;
    // const accessToken =
    //   authHeader?.startsWith("Bearer") && authHeader.split(" ")[1];

    const encryptedAccessToken = req.cookies.accessToken;

    const decryptAccessToken = decryptJWT(encryptedAccessToken);

    if (!decryptAccessToken) {
      return res.status(401).json({
        message: "Unauthorized | You are not logged in and Token is not exists",
      });
    }

    // is verify token valid in cookie?
    jwt.verify(
      decryptAccessToken,
      ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              message: "Unauthorized | Token expired",
            });
          }

          return res
            .status(403)
            .json({ message: "Forbidden | Token is not valid" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
          return res.status(403).json({
            message: "Forbidden | User not found and Token is not valid",
          });
        }

        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unauthorized | Token is not valid" });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden | You are not admin" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unauthorized" });
  }
};
