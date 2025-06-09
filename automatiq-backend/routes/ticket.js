import express from "express";
import { authenticate } from "../middlewares/auth";
import { getTickets, getTicket, createTicket } from "../controllers/ticket";

const router = express.Router();

router.post("/", authenticate, createTicket);
router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicket);

export default router;
