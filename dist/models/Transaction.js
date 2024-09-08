import { Schema, model } from "mongoose";
const TransactionSchema = new Schema({
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
export const Transaction = model("Transaction", TransactionSchema);
