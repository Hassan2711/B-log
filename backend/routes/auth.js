const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const mongoose = require('mongoose');

const router = express.Router();

const loginSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const loginModel = mongoose.model("loginCredential", loginSchema);
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let existingUser = await loginModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(password, salt);
        const user = new loginModel({ name, email, password: hashedPw });
        await user.save();

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await loginModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Wrong Credentials" });
        }
        const comparePw = await bcrypt.compare(password, user.password);
        if (!comparePw) {
            return res.status(400).json({ error: "Wrong Credentials" });
        }

        const payload = { user: { id: user.id } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await loginModel.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
