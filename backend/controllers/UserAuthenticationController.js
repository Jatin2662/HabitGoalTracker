

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
const UserModel = require("../models/UserModel");
const SendVerificationMail = require('../utils/SendVerificationMail');

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

        const user = await UserModel.findOne({ email })

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15min' }
        )

        const verificationLink = `https://habitgoaltracker-1.onrender.com/auth/verify/${token}`

        SendVerificationMail(email, verificationLink)

        res.status(201).json({ message: "User Created and Email has been sent, verify to login.", success: true });

    } catch (err) {

        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const verifyEmail = async (req, res, next) => {

    try {
        const { token } = req.params;

        if (!token) {
            return res.status(403).json({ message: "Send Link to verify.", success: false })
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: "Invalid or expired token.", success: false });
        }

        const user = await UserModel.findById(decoded._id)

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false })
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email has been verified.", success: true })
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const EmailVerification = async (req, res, next) => {
    try {
        const { email, linkName } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) return res.status(400).json({ message: "No user found.", success: false })

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15min' }
        )

        let verificationLink;
        if (linkName === 'verify') {
            verificationLink = `https://habitgoaltracker-1.onrender.com/auth/verify/${token}`
        } else if (linkName === 'reset-password') {
            verificationLink = `https://habitgoaltracker-1.onrender.com/auth/reset-password/${token}`
        } else {
            return res.status(400).json({ message: "Invalid request.", success: false })
        }

        SendVerificationMail(email, verificationLink, linkName)

        res.status(200).json({ message: `Email has been sent, ${linkName} to continue.`, success: true })
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const getPasswordChangeRequest = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(403).json({ message: "Send Link to reset password.", success: false })
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(400).json({ message: "Invalid or expired token.", success: false });
        }

        const user = await UserModel.findById(decoded._id).select('email').lean();

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false })
        }

        res.status(200).json({ message: "Proceed to reset the password.", success: true, user })

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const resetPassword = async (req, res, next) => {

    try{
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({ message: "passwords does not match.", success: false })
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(400).json({ message: "Invalid or expired token.", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.findByIdAndUpdate(
            decoded._id,
            { $set: {password: hashedPassword} },
            { new: true }
        );

        await user.save();

        res.status(200).json({ message: "Password updated successfully.", success: true })

    }catch(err){
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

        if (!user.isVerified) {
            return res.status(403).json({ message: "Email not verified, proceed to email verification", success: false })
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
    verifyEmail,
    EmailVerification,
    getPasswordChangeRequest,
    resetPassword
}