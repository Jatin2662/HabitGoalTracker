

const UserModel = require("../models/UserModel");
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen');
const MailModel = require("../models/AdminMail");


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

const sendMail = (subject, body, end, email) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // console.log(subject, body, end, email)

    // let MailGenerator = new Mailgen({
    //     theme: "default",
    //     product: {
    //         name: "Mailgen",
    //         link: 'https://mailgen.js/'
    //     }
    // });

    // let info = {
    //     body: {
    //         name: "Box",
    //         intro: "Hello",
    //         outro: "Bye"
    //     }
    // }

    // let mail = MailGenerator.generate(info);

    let info2 = `
     <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f8ff;">
        <table align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-collapse: collapse;">
          <tr>
            <td style="background-color: #005f73; color: #ffffff; text-align: center; padding: 20px; font-size: 24px;">
              Habit Tracker
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <h2 style="margin-top: 0;">Hey, ${email}!</h2>
              <p>Habit tracker is waiting for you, <strong>Go</strong></p>
              <p>${body}</p>
              <h4>${end}</h4>
            </td>
          </tr>
          <tr>
            <td style="background-color: #d3e0ea; padding: 15px; font-size: 12px; text-align: center; color: #555;">
              &copy; 2025 The Habit Tracker. All Rights Reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
    `


    let message = {
        from: process.env.EMAIL,
        to: email,
        replyTo: process.env.EMAIL,
        subject: subject || "Activate",
        html: info2
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

        const emailContent = await MailModel.find();

        if (!emailContent) {
            return res.status(404).json({ message: "No email content found.", success: false })
        }

        // console.log(emailContent)

        const { subject, body, end } = emailContent[0];

        // console.log(subject, body, end)

        // console.log(userEmail.email);

        sendMail(subject, body, end, userEmail.email)

        res.status(201).json({ message: "Mail sent successfully.", success: true })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

const setMailContent = async (req, res, next) => {

    const { subject, body, end, mailId } = req.body;
    try {

        if (!mailId) {

            // it will become post request
            const mail = new MailModel({
                subject,
                body,
                end
            })
            await mail.save();
            return res.status(200).json({ message: "Mail body set.", success: true, mail })
        }

        // and this will be put request, see frontend what I did, is written there.
        const mail = await MailModel.findByIdAndUpdate(
            mailId,
            { subject, body, end },
            { new: true }
        )

        res.status(200).json({ message: "Mail content updated successfully.", success: true, mail })

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

const getMailContent = async (req, res, next) => {

    try {

        const mailContent = await MailModel.find().lean();

        if (mailContent.length === 0) {
            return res.status(404).json({ message: "You might haven't set the mail body.", success: false })
        }

        res.status(200).json({ message: "Mail content retrieved.", success: true, mailContent })
    } catch (err) {
        return res.status(500).json({ message: "Internal sever error", success: false })
    }
}

module.exports = {
    adminDashboardData,
    getAllUsers,
    notifySingleUser,
    setMailContent,
    getMailContent
}