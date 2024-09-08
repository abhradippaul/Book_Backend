import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import bookRouter from "./routes/book.route.js";
import transactionRouter from "./routes/transaction.route.js";
import dbConnect from "./dbConnect.js";
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
dbConnect()
    .then(() => {
    app.listen(process.env.PORT || 80, () => {
        console.log("Server connected");
    });
})
    .catch((err) => {
    console.log("Express connection error ", err);
});
export default app;
