import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      unique: [true, "email already exists"],
      required: [true, "email is required"],
    },
    clerkId: {
      type: String,
      unique: [true, "clerkId already exists"],
      required: [true, "clerkId is required"],
    },
  },
  { timestamps: true },
);

export const user = mongoose.model("user", userSchema);
