import { category } from "../models/categories.js";

export const getAllCategory = async (req, res) => {
  try {
    const categories = await category.find({ createdBy: req.userId });
    return res.status(200).json({ data: categories });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server Error");
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, budget, bgColor, icon } = req.body;
    const newCategory = await category.create({
      name,
      budget,
      bgColor,
      icon,
      createdBy: req.userId,
    });
    return res.status(200).json({ data: newCategory });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server Error");
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { name, budget, bgColor, icon } = req.body;
    const existingCategory = await category.findOne({
      _id,
      createdBy: req.userId,
    });
    if (!existingCategory) {
      return res.send("category not found");
    }
    const updatedCategory = await category
      .findByIdAndUpdate(
        existingCategory._id,
        {
          name,
          budget,
          bgColor,
          icon,
        },
        { new: true }
      )
      .select("_id name budget bgColor icon");
    return res.status(200).json(updatedCategory);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server Error");
  }
};
