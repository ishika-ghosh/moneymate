import { category } from "../models/categories.js";
import { expense } from "../models/expense.js";
import moment from "moment-timezone";

export const getAllExpense = async (req, res) => {
  try {
    const { date } = req.query;
    let todayStart, todayEnd;
    if (date) {
      const [day, month, year] = date.split("/").map(Number);
      const newDate = new Date(year, month - 1, day);
      todayStart = new Date(newDate);
      todayStart.setHours(0, 0, 0, 0);

      todayEnd = new Date(newDate);
      todayEnd.setHours(23, 59, 59, 999);
    } else {
      todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
    }
    const expenses = await expense
      .find({
        createdBy: req.userId,
        createdAt: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      })
      .populate("category", "name _id bgColor icon")
      .select("desc amount _id createdAt");
    return res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server Error");
  }
};
export const createExpense = async (req, res) => {
  try {
    const { desc, amount, category: categoryId } = req.body;
    const existingCategory = await category.findOne({
      _id: categoryId,
      createdBy: req.userId,
    });
    if (!existingCategory) {
      return res.send("category not found");
    }
    const newExpense = await expense.create({
      desc,
      amount,
      category: existingCategory._id,
      createdBy: req.userId,
    });
    const createdExpense = await expense
      .findById(newExpense._id)
      .populate("category", "name _id bgColor icon")
      .select("desc amount _id createdAt");
    return res.status(200).json(createdExpense);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
export const updateExpense = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const updated = req.body;
    const updatedexpense = await expense
      .findByIdAndUpdate(_id, updated, { new: true })
      .populate("category", "name _id bgColor icon")
      .select("desc amount _id createdAt");
    return res.status(200).json(updatedexpense);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server Error");
  }
};
export const deleteExpense = async (req, res) => {
  try {
    const { id: _id } = req.params;
    await expense.findByIdAndDelete(_id);
    return res.status(200).json({ message: "expense deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server Error");
  }
};
