import express from "express";
import {
  getUser,
  login,
  logout,
  signup,
  updateSkills,
  updateUser,
} from "../controllers/user.js";
import authenticate from "../middlewares/auth.js";

const router = express.Router();

router.post("/update-user", authenticate, updateUser);

router.get("/users", authenticate, getUser);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-skills", authenticate, updateSkills);

export default router;
