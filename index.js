import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import categoryRoutes from "./routes/category.js";
import userRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";
import analyticsRoutes from "./routes/analytics.js";
import sharedBudgetRoutes from "./routes/sharedBudget.js";
import sharedExpenseRoutes from "./routes/budgetExpense.js";
import calculationRoutes from "./routes/calculation.js";

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//endpoints
app.use("/category", categoryRoutes);
app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/shared", sharedBudgetRoutes);
app.use("/shared/expense", sharedExpenseRoutes);
app.use("/shared/analysis", calculationRoutes);
app.get("/", (req, res) => {
  res.send("hello world");
});

//database connection
const CONNECTION_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", false);
mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, (req, res) =>
      console.log("Server is running on port " + PORT)
    )
  )
  .catch((error) => console.log(error));
