import {
  getDailyExpensesForUser,
  monthlyExpenseReport,
} from "../utils/index.js";
import moment from "moment-timezone";

export const getChartData = async (req, res) => {
  try {
    const { startdate } = req.query;
    const todayStartIST = moment.tz("Asia/Kolkata").startOf("day"); // Start of today in IST
    const todayEndIST = moment.tz("Asia/Kolkata").endOf("day"); // End of today in IST

    // Convert IST times to UTC
    const startOfDayUTC = todayStartIST.utc().toDate(); // Start of today in UTC
    const endOfDayUTC = todayEndIST.utc().toDate(); // End of today in UTC
    const data = await getDailyExpensesForUser(
      req.userId,
      startOfDayUTC,
      endOfDayUTC
    );
    const [day, month, year] = startdate.split("/").map(Number);
    const newDate = new Date(year, month - 1, day);
    const todayStart = new Date(newDate);
    todayStart.setHours(0, 0, 0, 0);
    const barChartData = await monthlyExpenseReport(req.userId, todayStart);
    return res.status(200).json({ data, barChartData });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server Error");
  }
};
export const getBarChartData = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
};
