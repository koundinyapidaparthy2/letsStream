import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;
    console.log({token})
    // Instead of sending the token in a cookie, send it in the response body
    res.status(200).json({
      ...others,
      access_token: token, // Add token to the response
    });
  } catch (err) {
    next(err);
  }
};


export const googleAuth = async (req, res, next) => {
  try {
    console.log({email})
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // User exists, generate a token
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res.status(200).json({
        ...user._doc,  // Send the user's data (excluding password)
        access_token: token,  // Include the token in the response
      });
    } else {
      // New user, create and save user
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();

      // Generate a token for the newly created user
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res.status(200).json({
        ...savedUser._doc,  // Send the new user's data (excluding password)
        access_token: token,  // Include the token in the response
      });
    }
  } catch (err) {
    next(err);
  }
};

