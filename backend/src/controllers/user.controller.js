import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const response = await User.find().select("-password");

    if (!response) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ users: response });
  } catch (error) {
    console.log(error, "error failed to get users");
    return res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { _id } = req.params;
    const response = await User.findById(_id).select("-password");

    if (!response) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: response });
  } catch (error) {
    console.log(error, "error failed to get user by id");
    return res.status(500).json({ message: "Failed to get user by id" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params;

    const response = await User.findByIdAndDelete(_id);

    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error, "error failed to delete user");
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, photo } = req.body;

    if (!name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { _id } = req.user;
    const response = await User.findByIdAndUpdate(_id, {
      name,
      photo,
    }).select("-password");

    res.status(200).json({
      user: response,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error, "error failed to update profile");
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
