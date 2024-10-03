import { budget } from "../models/budget.js";

export const getBudget = async (req, res) => {
  try {
    const budgetList = await budget
      .find({
        participants: req.emailId,
      })
      .populate("createdBy", "name email");
    return res.status(200).json(budgetList);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
export const createBudget = async (req, res) => {
  try {
    const { name, desc, participants } = req.body;
    const newBudget = await budget.create({
      name,
      desc,
      participants,
      createdBy: req.userId,
    });
    const createdBudget = await budget
      .findById(newBudget._id)
      .populate("createdBy", "name email");
    return res.status(200).json(createdBudget);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
export const updateBudget = async (req, res) => {
  try {
    const update = req.body;
    const { id: _id } = req.params;
    const existingBudget = await budget.findById(_id);
    if (!existingBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    if (String(req.userId) === String(existingBudget.createdBy)) {
      const updatedBudget = await budget
        .findByIdAndUpdate(_id, update, {
          new: true,
        })
        .populate("createdBy", "name email");
      return res.status(200).json(updatedBudget);
    } else {
      return res
        .status(403)
        .json({ message: "Only creator can change the budget" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
