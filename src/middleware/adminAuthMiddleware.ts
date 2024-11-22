import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token " + token);
    if (!token) {
      res.json({ message: "Unauthorized" }).status(403);
      return;
    }
    const decodedToken = jwt.decode(token) as {
      userRole: "ADMIN";
      userId: string;
    };
    console.log("decodedToken" + decodedToken);
    if (decodedToken.userRole === "ADMIN") {
      req.userId = decodedToken.userId;
      req.userRole = decodedToken.userRole;
    }
    console.log(decodedToken.userId, decodedToken.userRole);
    console.log(req.userId);
    next();
  } catch (error) {}
}
