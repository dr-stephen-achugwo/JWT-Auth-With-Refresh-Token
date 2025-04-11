import express from "express";
const Router = express.Router();
import {
  register,
  login,
  logout,
  me,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

Router.post("/register", register);
Router.post("/login", login);
Router.get("/refresh-token", refreshToken);
Router.post("/logout", authMiddleware, logout);
Router.get("/me", authMiddleware, me);

export default Router;
