import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  try {
    const hashedpass = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedpass, skills });

    // await inngest.send({
    //   name: "user/signup",
    //   data: {
    //     email,
    //   },
    // });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.json({ user, token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User Not Found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentails." });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.json({ user, token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Unauthorized" });
      res.json({ message: "Logout successfully" });
    });
  } catch (error) {
    if (err) return res.status(500).json({ error: "Logout Failed." });
  }
};

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden. Only admin have this rights" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills, role },
    );

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    if (err) return res.status(500).json({ error: "Update Failed." });
  }
};

export const getUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    if (err) return res.status(500).json({ error: "Fetching Failed." });
  }
};

export const updateSkills = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { skills } = req.body;
    const userSkills = await User.findById(user_id);
    const newSkills = skills.filter(
      (skill) => !userSkills.skills.includes(skill),
    );
    const updatedSkills = [...userSkills.skills, ...newSkills];

    await User.findByIdAndUpdate(user_id, { skills: updatedSkills });

    return res
      .status(200)
      .json({ message: "User skills updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update skills" });
  }
};
