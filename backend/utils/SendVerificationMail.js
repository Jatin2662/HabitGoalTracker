

const nodemailer = require('nodemailer')


const SendVerificationMail = async (email, verificationLink) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let html = `
        <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f8ff;">
        <table align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-collapse: collapse;">
          <tr>
            <td style="background-color: #005f73; color: #ffffff; text-align: center; padding: 20px; font-size: 24px;">
              Email Verification
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <h2 style="margin-top: 0;">Hey, ${email}!</h2>
              <p>Verification is neccessary to get notifications. </p>
              <p>Verify email, <strong>Go</strong>, click to verify <a href="${verificationLink}" >${verificationLink}</a></p>
              <h4>Happy Tracking!</h4>
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
    const message = {
        from: process.env.EMAIL,
        to: email,
        replyTo: process.env.EMAIL,
        subject: "This email is intended for only verification purpose.",
        html
    }

    await transporter.sendMail(message)
}

module.exports = SendVerificationMail;