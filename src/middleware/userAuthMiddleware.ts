import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function userAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.json({ message: "Unauthorized" }).status(403);
      return;
    }
    const decodedToken = jwt.decode(token) as {
      userRole: "USER";
      userId: string;
    };
    if (decodedToken.userRole === "USER") {
      req.userId = decodedToken.userId;
      req.userRole = decodedToken.userRole;
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
}
