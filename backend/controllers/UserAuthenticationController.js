

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
const UserModel = require("../models/UserModel");

const signup = async (req, res, next) => {


    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please LogIn", success: false })
        }

        const userModel = new UserModel({
            firstName,
            lastName,
            email,
            password,
            role: 'user',
            theme: 'light'
        });

        userModel.password = await bcrypt.hash(password, 10);

        await userModel.save();

        res.status(201).json({ message: "User Created.", success: true });

    } catch (err) {

        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}


const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const user = await UserModel.findOneAndUpdate({ email });
        const errorMessage = 'Authentication failed!!! email or password is incorrect.';

        if (!user) {
            return res.status(403).json({ message: errorMessage, success: false })
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMessage, success: false })
        }

        user.lastActive = new Date();    // added new lastActive for Admin analysis
        await user.save();

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({
            message: "Logged In Enjoy!!!",
            success: true,
            jwtToken,
            email,
            name: user.firstName + ' ' + user.lastName,
            // role: user.role,
            theme: user.theme
        })

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

module.exports = {
    signup,
    login,
}