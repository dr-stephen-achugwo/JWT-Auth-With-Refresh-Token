import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
      default: "",
    },
  },

  {
    timestamps: true,
    expires: "7d",
  }
);

const refreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default refreshToken;
