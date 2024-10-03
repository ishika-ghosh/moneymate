import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    budget: Number,
    bgColor: String,
    icon: { type: String },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: [true, "createdBy is required"],
    },
  },
  { timestamps: true },
);

export const category = mongoose.model("category", categorySchema);
