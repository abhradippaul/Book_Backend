import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import bookRouter from "./routes/book.route.js";
import transactionRouter from "./routes/transaction.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({
    message: "Server working fine",
  });
});

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/transactions", transactionRouter);

export default app;
