import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  // Retrieve the token from the 'Authorization' header
  const authHeader = req.headers.authorization;

  // If the header is not present or does not have the 'Bearer' token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "You are not authenticated!"));
  }

  // Extract the token by removing 'Bearer ' from the header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};
