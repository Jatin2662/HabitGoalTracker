

const UserModel = require("../models/UserModel");



const adminDashboardData = async (req, res, next) => {

    try{
        // Total users
        const Users = await UserModel.find();

        if(!Users){
            return res.status(404).json({ message: "No users", success: false })
        }

        const totalUsers = Users.length

        // Total active users
        const todayDate = new Date()

        res.status(200).json({
            message: "Data fetched securely.",
            success: true,
            totalUsers
        })

    }catch(err){
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = {
    adminDashboardData
}