import { Request, Response } from "express";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { Book } from "../models/Book.js";
import mongoose from "mongoose";

export async function createTransaction(req: Request, res: Response) {
  try {
    const { bookId, userId, issueDate } = req.body;

    if (!bookId || !userId || !issueDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const isUserExist = await User.findOne({ _id: userId });

    if (!isUserExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isBookExist = await Book.findOne({ _id: bookId });

    if (!isBookExist) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const alreadyIssuedBook = await Transaction.findOne({ bookId, userId });

    if (alreadyIssuedBook) {
      return res.status(400).json({
        message: "Book already issued",
      });
    }

    const newTransaction = new Transaction({
      bookId,
      userId,
      issueDate,
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

export async function createTransactionReturn(req: Request, res: Response) {
  try {
    const { bookId, userId, returnDate } = req.body;

    if (!bookId || !userId || !returnDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const isUserExist = await User.findOne({ _id: userId });

    if (!isUserExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isBookExist = await Book.findOne({ _id: bookId });

    if (!isBookExist) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const isBookIssued = await Transaction.findOne({ bookId, userId });

    if (!isBookIssued) {
      return res.status(404).json({
        message: "Book not issued",
      });
    }

    const issuedDataInMili = new Date(isBookIssued.issueDate).getTime();
    const returnDataInMili = new Date(returnDate).getTime();

    if (returnDataInMili < issuedDataInMili) {
      return res.status(400).json({
        message: "Return date cannot be before issue date",
      });
    }

    // if (returnDataInMili > new Date().getTime()) {
    //   return res.status(400).json({
    //     message: "Return date cannot be in the future",
    //   });
    // }

    const totalRent =
      ((returnDataInMili - issuedDataInMili) / (24 * 60 * 60 * 1000) + 1) *
      isBookExist.rentPerDay;

    const updatedTransaction = await Transaction.updateOne(
      { bookId, userId },
      {
        $set: {
          returnDate,
          totalRent,
        },
      }
    );

    if (!updatedTransaction.modifiedCount) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(201).json({
      message: "Transaction created successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getUsersWithSameBook(req: Request, res: Response) {
  try {
    const { bookName } = req.params;

    if (!bookName) {
      return res.status(400).json({
        message: "book name is required",
      });
    }

    const isBookExist = await Book.find({ bookName });

    if (!isBookExist.length || !isBookExist[0]._id) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const users = await Book.aggregate([
      {
        $match: {
          bookName,
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "bookId",
          as: "transactionDetails",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $addFields: {
                userDetails: {
                  $first: "$userDetails",
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          userDetails: "$transactionDetails.userDetails",
        },
      },
      {
        $project: {
          _id: 0,
          userDetails: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Users found successfully",
      data: {
        ...users[0],
        totalIssuedCount: users[0].userDetails.length,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getTotalRentWithBook(req: Request, res: Response) {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({
        message: "book id is required",
      });
    }

    const books = await Transaction.find({ bookId });

    let totalRent = 0;

    for (let i = 0; i < books.length; i++) {
      totalRent += books[i].totalRent || 0;
    }

    return res.status(200).json({
      message: "Total rent from book fetched successfully",
      data: totalRent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getBooksWithUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User id is required",
      });
    }

    const books = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $addFields: {
          bookDetails: {
            $first: "$bookDetails",
          },
        },
      },
      {
        $project: {
          _id: 0,
          bookDetails: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Books fetched successfully",
      data: books,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getTransactionsBetweenRange(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start and end date are required",
      });
    }

    const transactions = await Transaction.aggregate([
      {
        $match: {
          issueDate: {
            $gte: new Date(startDate.toString()),
            $lte: new Date(endDate.toString()),
          },
        },
      },
    ]);

    return res.status(200).json({
      message: "Transactions fetched successfully",
      data: transactions,
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
