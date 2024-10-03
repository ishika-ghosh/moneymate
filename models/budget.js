import mongoose from "mongoose";

const budgetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "name should be unique"],
    },
    desc: { type: String, default: "" },
    participants: [
      {
        type: String,
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: [true, "createdBy is required"],
    },
  },
  { timestamps: true }
);
const budgetExpenseSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    paidBy: {
      type: String,
      required: [true, "paidBy is required"],
    },
    paidFor: [
      {
        user: {
          type: String,
          required: true,
        },
        share: {
          type: Number, // Amount that the user needs to pay for this expense
          required: true,
        },
      },
    ],
    budget: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "budget",
      required: [true, "Budget is required"],
    },
  },
  { timestamps: true }
);

export const budget = mongoose.model("budget", budgetSchema);
export const budgetExpense = mongoose.model(
  "budgetExpense",
  budgetExpenseSchema
);
