import { expense } from "../models/expense.js";
import mongoose from "mongoose";
import moment from "moment-timezone";

export const getDailyExpensesForUser = async (userId, startDate, endDate) => {
  const objectId = new mongoose.Types.ObjectId(String(userId));
  const dailyAnalytics = await expense.aggregate([
    {
      // Match the expenses based on userId and the specific date
      $match: {
        createdBy: objectId,
        createdAt: {
          $gte: startDate, // Start of the day
          $lt: endDate, // End of the day
        },
      },
    },
    {
      // Lookup to populate the category details
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      // Unwind the category details
      $unwind: "$categoryDetails",
    },
    {
      // Group by category
      $group: {
        _id: {
          category: "$categoryDetails.name",
        },
        totalAmount: { $sum: "$amount" }, // Total amount for the category
        count: { $sum: 1 }, // Count of expenses for the category
      },
    },
    {
      // Project the result to a more readable format
      $project: {
        _id: 0,
        category: "$_id.category",
        totalAmount: 1,
        count: 1,
      },
    },
  ]);
  const totalSum = dailyAnalytics.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  const scaleFactor = 100 / totalSum;
  const scaledData = dailyAnalytics.map((item) => ({
    ...item,
    scaledAmount: Math.round(item.totalAmount * scaleFactor),
  }));
  scaledData.sort((a, b) => b.scaledAmount - a.scaledAmount);
  return { scaledData, totalSum };
};
export const monthlyExpenseReport = async (userId, startDate) => {
  try {
    const objectId = new mongoose.Types.ObjectId(String(userId));
    const today = new Date();

    // MongoDB aggregation query
    const expenses = await expense.aggregate([
      {
        $match: {
          createdBy: objectId,
          createdAt: {
            $gte: startDate,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    const formattedExpenses = expenses.map((expense) => ({
      month: moment()
        .month(expense._id.month - 1)
        .format("MMM"), // Get month name
      year: expense._id.year,
      totalAmount: expense.totalAmount,
      count: expense.count,
    }));

    return formattedExpenses;
  } catch (err) {
    console.log(err);
  }
};
