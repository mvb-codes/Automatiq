import cors from "cors";
import express from "express";
import { serve } from "inngest/express";
import { mongoose } from "mongoose";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/signup.js";
import { onTicketCreated } from "./inngest/functions/ticket.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated],
  }),
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => console.log(` Server at http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB Error:", err));
