import express from "express";
import {
  createTransaction,
  createTransactionReturn,
  getBooksWithUser,
  getTotalRentWithBook,
  getTransactions,
  getTransactionsBetweenRange,
  getUsersWithSameBook,
} from "../controllers/Transaction.controller.js";
const router = express.Router();

router.route("/").get(getTransactions);

router.route("/issue").post(createTransaction);

router.route("/return").patch(createTransactionReturn);

router.route("/book/:bookName/users").get(getUsersWithSameBook);

router.route("/book/:bookId/rent").get(getTotalRentWithBook);

router.route("/user/:userId/books").get(getBooksWithUser);

router.route("/date-range").get(getTransactionsBetweenRange);

export default router;
