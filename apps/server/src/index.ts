import express from "express";
import db from "database/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import { registerUserSchema } from "common/schema"

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World")
});

app.post("/signup", async (req, res) => {

    const validatedFields = registerUserSchema.safeParse(req.body);

    if (!validatedFields.success) {
            console.error("Validation failed:", validatedFields.error);
            return res.status(400).json({ error: "Validation failed" });
        }

    const { username, password, name } = validatedFields.data
    

    if(!username || !password) {
        res.status(400).send("Email and password are required")
    }

    const hashPassword = bcrypt.hash(password, 10);

    try {
        await db.user.create({
            data: {
                username,
                // @ts-expect-error undefined
                password: hashPassword,
                name
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }

})

app.post("/login", (req, res) => {
    res.send("Login")
});

app.post("/room", middleware, (req, res) => {
    res.send("Room")
});

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});