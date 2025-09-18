import { JWT_SECRET } from "common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";



export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || "";

    // @ts-ignore
    const decoded = jwt.verify(token as string, JWT_SECRET);
    
    // @ts-ignore
    if (!decoded || !decoded.id) {
        res.status(403).send("Unauthorized");
    }

    // @ts-expect-error undefined
    req.userId = decoded.id
    next();

}