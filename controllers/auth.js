import { user } from "../models/users.js";
export const createUser = async (req, res) => {
  console.log("here");
  const { name, email, clerkId } = req.body;
  try {
    const exixtingUser = await user.findOne({ email });
    if (exixtingUser) {
      console.log("user already exists");
    } else {
      const newUser = await user.create({
        name,
        email,
        clerkId,
      });
      console.log(newUser);
      return res.status(200).json({ data: newUser });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
