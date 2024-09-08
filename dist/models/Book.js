import { Schema, model } from "mongoose";
const BookSchema = new Schema({
    bookName: { type: String, required: true },
    category: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
});
export const Book = model("Book", BookSchema);
