import express from "express";
import { createUser, getAllUsers } from "../controllers/User.controller.js";
const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);

export default router;
