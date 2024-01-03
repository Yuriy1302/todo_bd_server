const { Router } = require("express");
const config = require("config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = Router();

const db = require("../db");

router.post("/registration", async (req, res) => {
    try {
        const { email, password } = req.body;

        const candidate = await db.query(
            "SELECT email FROM users WHERE email = $1",
            [email]
        );

        console.log('email >>> ', candidate.rows[0]?.email);

        if (candidate.rows[0]?.email) {
            return res.status(400).json({ message: "Такой пользователь уже существует" });
        }

        const hashPassword = await bcrypt.hash(password, 4);
    
        const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashPassword]
        );

        const token = jwt.sign(
            { userId: newUser.rows[0]._id },
            config.get("jwtSecret"),
            { expiresIn: '1h' }
        );

        res.status(200).json({
            userId: newUser.rows[0]._id,
            message: "Success registration",
            token
        });    
    } catch (err) {
        console.log('Err => ', err);
        res.status(400).json({ message: "Something went wrong!" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('email login >>> ', email);

        const user = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        console.log('user >>> ', user.rows[0]);

        if (!user.rows[0]?.email) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        const token = jwt.sign(
            { userId: user.rows[0]._id },
            config.get("jwtSecret"),
            { expiresIn: '1h' }
        );
    
        res.status(200).json({
            userId: user.rows[0]._id,
            token
        });    
    } catch (err) {
        console.log('Err => ', err);
        res.status(400).json({ message: "Something went wrong!" });
    }
});


module.exports = router;
