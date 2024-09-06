import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
  } catch (err) {
    console.log("Database connection error ", err);
  }
};

export default dbConnect;
