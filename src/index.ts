import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import dbConnect from "./dbConnect.js";

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 80, () => {
      console.log("Server connected");
    });
  })
  .catch((err) => {
    console.log("Express connection error ", err);
  });
