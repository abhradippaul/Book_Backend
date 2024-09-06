import { Request, Response } from "express";
import { Book } from "../models/Book.js";

export async function getAllBooks(req: Request, res: Response) {
  try {
    const books = await Book.find();
    return res.status(200).json({
      message: "Found all books",
      data: books,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getBookWithBookName(req: Request, res: Response) {
  try {
    const { bookName } = req.body;

    if (!bookName) {
      return res.status(400).json({
        message: "Missing required field.",
      });
    }

    const book = await Book.find({ bookName });

    if (!book.length) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      message: "Found book",
      data: book,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getBooksWithRent(req: Request, res: Response) {
  try {
    const { minRent, maxRent } = req.body;

    if (!minRent || !maxRent) {
      return res.status(400).json({
        message: "Missing required field(s).",
      });
    }

    const users = await Book.find({
      rentPerDay: {
        $gt: minRent,
        $lt: maxRent,
      },
    });
    return res.status(200).json({
      message: "Found all books",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getBooksWithAdvanceSearch(req: Request, res: Response) {
  try {
    const { category, bookName, minRent, maxRent } = req.body;

    if (!minRent || !maxRent || !bookName || !category) {
      return res.status(400).json({
        message: "Missing required field(s).",
      });
    }

    const users = await Book.find({
      category,
      bookName,
      rentPerDay: {
        $gt: minRent,
        $lt: maxRent,
      },
    });
    return res.status(200).json({
      message: "Found all books",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function createBook(req: Request, res: Response) {
  try {
    const { bookName, category, rentPerDay } = req.body;

    if (!bookName || !category || !rentPerDay) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newBook = new Book({ bookName, category, rentPerDay });
    await newBook.save();

    return res.status(201).json({
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
