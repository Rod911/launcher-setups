const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = mongoose.model("User");
const verifyAuth = require('../middleware/verifyLogin');

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let hashedPW = "";
        if (password === "") {
            hashedPW = password;
        } else {
            const salt = await bcrypt.genSalt(10);
            hashedPW = await bcrypt.hash(password, salt);
        }

        const user = await User.create({
            username,
            email,
            password: hashedPW,
        });

        return res.status(201).json({
            success: true,
            data: {
                userID: user._id,
                username: user.username,
                email: user.email,
                dateCreated: user.createdAt,
            }
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages,
            });
        }
        if (err.code === 11000) {
            if (err.keyValue.hasOwnProperty('email')) return res.status(400).json({
                success: false,
                error: "EMAIL_EXISTS",
            });
            if (err.keyValue.hasOwnProperty('username')) return res.status(400).json({
                success: false,
                error: "USERNAME_EXISTS",
            });
        }

        console.log(err);

        return res.status(500).json({
            success: false,
            error: 'UNKNOWN',
        });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({
            success: false,
            error: "CREDENTIALS",
        });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({
            success: false,
            error: "CREDENTIALS",
        });

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        return res.header('auth-token', token).status(200).json({
            success: true,
            user: {
                email: user.email,
                username: user.username,
                _id: user._id,
            },

        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'UNKNOWN',
        });
    }
});

router.get('/profile', verifyAuth, async (req, res) => {
    try {
        const { userID } = req.body;
        const user = await User.findById(userID || req.user);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Umknown username"
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {

    }
})

router.get('/', (req, res) => {
    res.status(200).json({
        route: 'ok'
    })
})

module.exports = router;