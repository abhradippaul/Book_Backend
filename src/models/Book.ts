import { Document, Schema, model } from "mongoose";

export interface IBook extends Document {
  bookName: string;
  category: string;
  rentPerDay: number;
}

const BookSchema: Schema = new Schema({
  bookName: { type: String, required: true },
  category: { type: String, required: true },
  rentPerDay: { type: Number, required: true },
});

export const Book = model<IBook>("Book", BookSchema);
