

const UserModel = require("../models/UserModel");
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')


const adminDashboardData = async (req, res, next) => {

    try {
        // Total users
        const Users = await UserModel.find().select('createdAt lastActive').lean().exec();

        if (!Users) {
            return res.status(404).json({ message: "No users", success: false })
        }

        const totalUsers = Users.length;

        // Total active users
        function NormalizeToUTCHours(date) {
            const d = new Date(date);
            d.setUTCHours(0, 0, 0, 0)

            return d;
        }

        // console.log(Users)
        const thirtyDaysBack = new Date();
        thirtyDaysBack.setDate(thirtyDaysBack.getDate() - 30)

        // console.log(todayDate, lastMonthDate)
        // console.log(totalUsers)

        let activeUsers = 0;
        for (let i = 0; i < totalUsers; i++) {
            const d = NormalizeToUTCHours(new Date(Users[i].lastActive));

            if (d >= NormalizeToUTCHours(thirtyDaysBack)) {
                activeUsers++;
            }
        }

        // console.log("Active", activeUsers);
        const inActiveUsers = totalUsers - activeUsers;

        // New User 7 days

        const sevenDaysBack = new Date()
        sevenDaysBack.setDate(sevenDaysBack.getDate() - 7)

        const { newUsers } = Users.reduce((acc, user) => {

            const createdAt = NormalizeToUTCHours(user.createdAt);
            // console.log(NormalizeToUTCHours(sevenDaysBack), createdAt)
            if (createdAt >= NormalizeToUTCHours(sevenDaysBack)) {
                acc.newUsers++
            }
            return acc
        }, { newUsers: 0 })

        // console.log("New :", newUsers)

        res.status(200).json({
            message: "Data fetched securely.",
            success: true,
            totalUsers,
            activeUsers,
            inActiveUsers,
            newUsers
        })

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getAllUsers = async (req, res, next) => {

    try {
        const users = await UserModel.find()
            .select('firstName lastName email createdAt lastActive')
            .lean()
            .sort({ createdAt: -1 });   // recent comes first

        // .select('-theme -password -role')

        // console.log(users)

        res.status(200).json({ message: "All users fetched.", success: true, users: users })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

const sendMail = (email) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    let MailGenerator = new Mailgen({
        theme: "default",
        product:{
            name: "Mailgen",
            link: 'https://mailgen.js/'
        }
    });

    let info = {
        body:{
            name: "Box",
            intro: "Hello",
            outro: "Bye"
        }
    }

    let mail = MailGenerator.generate(info);

    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Activate",
        html: mail
    }

    transporter.sendMail(message)
    // let message = {
    //     from: process.env.EMAIL,
    //     to: email,
    //     subject: "Hello",
    //     text: "I am Admin",
    //     html: "<h1>Admin sent a message</h1>"
    // }
}

const notifySingleUser = async (req, res, next) => {

    const userId = req.body.id;
    try {
        const userEmail = await UserModel.findById(userId).select('email');

        if (!userEmail) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        console.log(userEmail.email);

        sendMail(userEmail.email)

        res.status(201).json({ message: "Mail sent successfully.", success: true })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = {
    adminDashboardData,
    getAllUsers,
    notifySingleUser
}