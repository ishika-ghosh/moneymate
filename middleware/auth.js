import { createClerkClient } from "@clerk/clerk-sdk-node";
import { user } from "../models/users.js";

const clerk = createClerkClient({ secretKey: process.env.SECRET_KEY });

const auth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = await clerk.verifyToken(token, {
        jwtKey: process.env.JWT_KEY,
      });
      console.log(decoded.sub);
      const existingUser = await user.findOne({ clerkId: decoded.sub });
      if (!existingUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.userId = existingUser._id;
      req.emailId = existingUser.email;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal server Error");
    }
  } else {
    console.log("Invalid authorization");
    return res.status(401).json({ error: "Unauthorized" });
  }
};
export default auth;
