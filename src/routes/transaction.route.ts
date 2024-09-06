import express from "express";
import {
  createTransaction,
  getTransactions,
} from "../controllers/Transaction.controller.js";
const router = express.Router();

router.route("/").get(getTransactions);

router.route("/issue").post(createTransaction);

export default router;
