import mongoose from "mongoose";

const expenseSchema = mongoose.Schema(
  {
    desc: String,
    amount: { type: Number, required: [true, "amount is required"] },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category",
      required: [true, "category is required"],
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: [true, "createdBy is required"],
    },
  },
  { timestamps: true },
);

export const expense = mongoose.model("expense", expenseSchema);
