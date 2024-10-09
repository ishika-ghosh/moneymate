import { budget, budgetExpense } from "../models/budget.js";
export const getAllExpense = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const existingBudget = await budget.findById(_id);
    if (!existingBudget) {
      return res.status(404).send("budget not found");
    }
    if (!existingBudget.participants.includes(req.emailId)) {
      return res.status(403).send("Only members can access the expenses");
    }
    const expenseList = await budgetExpense.find({
      budget: existingBudget._id,
    });
    return res.status(200).json(expenseList);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
export const createExpense = async (req, res) => {
  try {
    const { description, budgetId, paidBy, paidFor } = req.body;
    const existingBudget = await budget.findById(budgetId);
    if (!existingBudget) {
      return res.status(404).send("budget not found");
    }
    if (!existingBudget.participants.includes(req.emailId)) {
      return res.status(403).send("Only members can access the expenses");
    }
    const createdExpense = await budgetExpense.create({
      description,
      budget: existingBudget._id,
      paidBy,
      paidFor,
    });
    return res.json(createdExpense);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
export const updateBudgetExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const existingExpense = await budgetExpense.findById(id).populate("budget");
    if (!existingExpense) {
      return res.status(404).send("expense not found");
    }
    if (existingExpense.budget.participants.includes(req.emailId)) {
      const updatedExpense = await budgetExpense.findByIdAndUpdate(
        id,
        updated,
        { new: true }
      );
      return res.status(200).json(updatedExpense);
    } else {
      return res.status(403).send("You can not update expense");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const existingExpense = await budgetExpense.findById(id).populate("budget");
    if (!existingExpense) {
      return res.status(404).send("expense not found");
    }
    if (existingExpense.budget.participants.includes(req.emailId)) {
      await budgetExpense.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ success: true, message: "Expense Deleted successfully" });
    } else {
      return res.status(403).send("You can not update expense");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};

export const getExpenseAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBudget = await budget.findById(id);
    if (!existingBudget) {
      return res.status(404).send("budget not found");
    }
    if (!existingBudget.participants.includes(req.emailId)) {
      return res.status(403).send("Only members can access the expenses");
    }
    const expenseList = await budgetExpense.find({
      budget: existingBudget._id,
    });
    const netBalances = {};
    const expensePerHead = {};
    const payerList = {};
    const analysis = {};
    const n = existingBudget.participants.length;
    for (var i = 0; i < n; i++) {
      netBalances[existingBudget.participants[i]] = {};
      analysis[existingBudget.participants[i]] = {};
      expensePerHead[existingBudget.participants[i]] = 0;
      payerList[existingBudget.participants[i]] = 0;
      for (var j = i + 1; j < n; j++) {
        netBalances[existingBudget.participants[i]][
          existingBudget.participants[j]
        ] = 0;
      }
      for (var j = 0; j < n; j++) {
        if (i === j) continue;
        analysis[existingBudget.participants[i]][
          existingBudget.participants[j]
        ] = 0;
      }
    }
    expenseList.forEach((expense) => {
      const paidBy = expense.paidBy;
      expense.paidFor.forEach((entry) => {
        const user = entry.user;
        const share = entry.share;
        payerList[paidBy] += share;
        expensePerHead[user] += share;
        if (user == paidBy) return;
        if (netBalances[user].hasOwnProperty(paidBy)) {
          netBalances[user][paidBy] -= share;
        } else {
          netBalances[paidBy][user] += share;
        }
      });
    });

    for (let payer in netBalances) {
      if (Object.keys(payer).length > 0) {
        for (let ower in netBalances[payer]) {
          if (netBalances[payer][ower] < 0) {
            analysis[ower][payer] += netBalances[payer][ower] * -1;
          } else {
            analysis[payer][ower] += netBalances[payer][ower];
          }
        }
      }
    }
    let finaldata = [];
    for (let creditor in analysis) {
      let debtors = [];
      for (let debtor in analysis[creditor]) {
        if (analysis[creditor][debtor] > 0) {
          debtors.push({
            debtor: debtor,
            amount: analysis[creditor][debtor],
          });
        }
      }
      finaldata.push({
        creditor: creditor,
        debtors: debtors,
        selfExpense: expensePerHead[creditor],
        totalExpense: payerList[creditor],
      });
    }
    return res.status(200).json(finaldata);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
