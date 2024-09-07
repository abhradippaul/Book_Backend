import { Document, Schema, Types, model } from "mongoose";

export interface ITransaction extends Document {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  issueDate: Date;
  returnDate?: Date;
  totalRent?: number;
}

const TransactionSchema: Schema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Book",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date },
  totalRent: { type: Number },
});

export const Transaction = model<ITransaction>(
  "Transaction",
  TransactionSchema
);
