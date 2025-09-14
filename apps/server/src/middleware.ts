import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "common/config";



export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || "";

    const decoded = jwt.verify(token as string, JWT_SECRET);
    
    if (!decoded) {
        res.status(403).send("Unauthorized");
    }

    // @ts-expect-error undefined
    req.userId = decoded;
    next();

}