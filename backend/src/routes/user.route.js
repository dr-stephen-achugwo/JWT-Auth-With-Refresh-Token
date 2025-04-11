import express from "express";
const Router = express.Router();
import {
  getAllUsers,
  deleteUser,
  updateProfile,
} from "../controllers/user.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";

Router.get("/", authMiddleware, adminMiddleware, getAllUsers);
Router.delete("/:id", authMiddleware, deleteUser);
Router.put("/profile", authMiddleware, updateProfile);

export default Router;
