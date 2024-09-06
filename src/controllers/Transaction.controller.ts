import { Request, Response } from "express";
import { Transaction } from "../models/Transaction.js";

export async function createTransaction(req: Request, res: Response) {
  try {
    const { bookId, userId, issueDate, returnDate, totalRent } = req.body;

    if (!bookId || !userId || !issueDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newTransaction = new Transaction({
      bookId,
      userId,
      issueDate,
      returnDate,
      totalRent,
    });
    await newTransaction.save();

    return res.status(201).json({
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json({
      message: "Found all books",
      data: transactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
