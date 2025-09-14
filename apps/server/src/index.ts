import express from "express";
import db from "database/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import { loginUserSchema, registerUserSchema } from "common/schema"
import { JWT_SECRET } from "common/config";

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
    

    if(!username || !password || !name) {
        res.status(400).send("username and password is required")
        return
    }

    await db.user.findUnique({
        where: {
            username
        }
    }).then((user) => {
        if(user) {
            res.status(400).send("User already exists")
        }
    })

    const hashPassword = await bcrypt.hash(password, 12);

    try {
        const user = await db.user.create({
            data: {
                username,
                password: hashPassword,
                name
            }
        })

        res.status(200).send({
            message: "User created successfully",
            id: user.id
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }

})

app.post("/login", async (req, res) => {
    
    const validatedField = loginUserSchema.safeParse(req.body);

    if (!validatedField.success) {
            console.error("Validation failed:", validatedField.error);
            return res.status(400).json({ error: "Validation failed" });
    }

    const { username, password } = validatedField.data

    if(!username || !password) {
        res.status(400).send("Email and password are required")
    }

    const existingUser = await db.user.findUnique({
        where: {
            username
        }
    })

    if(!existingUser) {
        res.status(400).send("User does not exist")
        return
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password as string);

    if(!matchPassword) {
        res.status(400).send("Invalid password")
        return
    }

    const token = jwt.sign({ id: existingUser.id }, JWT_SECRET);

    res.json({
        token
    })

});

app.post("/room", middleware, (req, res) => {
    res.send("Room")
});

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});