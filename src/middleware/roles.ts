import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!allowedRoles.includes(userRole))
      return res.status(403).json({ message: "Access forbidden" });

    next();
  };
