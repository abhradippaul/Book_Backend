import { User } from "../models/User.js";
import { Request, Response } from "express";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find();
    return res.status(200).json({
      message: "Found all users",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const isAlreadyExist = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (isAlreadyExist) {
      return res
        .status(409)
        .json({
          message: "User with this email or phone number already exists.",
        });
    }

    const newUser = new User({ name, email, phoneNumber });
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
