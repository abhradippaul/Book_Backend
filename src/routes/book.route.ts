import express from "express";
import {
  createBook,
  getAllBooks,
  getBooksWithRent,
  getBookWithBookName,
} from "../controllers/Book.controller.js";
const router = express.Router();

router.route("/").get(getAllBooks).post(createBook);

router.route("/search").get(getBookWithBookName);

router.route("/rent").get(getBooksWithRent);
router.route("/search/advanced").get(getBooksWithRent);

export default router;
