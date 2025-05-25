const HabitModel = require("../models/HabitModel");
const UserModel = require("../models/UserModel");


const addHabit = async (req, res, next) => {

    const { habit, habitDescription, repeat, custom_repeat, startDate, endDate, state } = req.body;
    const userId = req.user._id;

    try {

        const newHabit = new HabitModel({ userId, habit, habitDescription, repeat, custom_repeat, startDate, endDate: endDate || null, state });
        await newHabit.save()

        res.status(200).json({ message: "Your new Habit added successfully!!!", success: true })
    } catch (err) {
        res.status(500).json({ message: "Could add new Habit. Please try again", err, success: false })
    }
}

const getHabits = async (req, res, next) => {

    const userId = req.user._id;

    try {

        const allHabits = await HabitModel.find({ userId }).lean();
        //with lean we get plain objects immediately. No Mongoose overhead. Great for performance and sending data to clients.

        if (!allHabits || allHabits.length === 0) {
            return res.status(200).json({ message: "No Habits, Add some!!!", success: false })
            // status -> 204 gives no content then manage in frontend or pass 200 
        }

        res.status(200).json({ message: "All Habits fetched!!!", habits: allHabits, success: true })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err, success: false })
    }
}

const updateHabit = async (req, res, next) => {

    const habitId = req.params.habitId;
    const updateFields = req.body;


    try {
        const updatedHabit = await HabitModel.findByIdAndUpdate(
            habitId,
            { $set: updateFields }, // ensure only changed fields get updated
            { new: true }
        );

        if (!updateHabit) {
            return res.status(404).json({ message: "Habit not found.", success: false });
        }

        res.status(200).json({ message: "Habit updated Successfully.", success: true, data: updatedHabit })

    } catch (err) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}

const deleteHabit = async (req, res, next) => {

    const habitId = req.params.habitId;

    try {

        const deleteHabit = await HabitModel.findByIdAndDelete(habitId)

        if (!deleteHabit) {
            return res.status(404).json({ message: "Could not find the Habit.", success: false })
        }

        res.status(200).json({ message: "Habit deleted successfully.", success: true })
    } catch (err) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}

const getUserSettings = async (req, res, next) => {

    const userId = req.user._id;

    try {
        const userData = await UserModel.findById(userId).select('firstName lastName theme').lean().exec();

        // const user = await UserModel.findById(userId)
        //     .select('-password') // exclude password and get everything
        //     .exec();

        if (!userData) {
            return res.status(400).json({ message: "Something went wrong, Could not fetch data.", success: false })
        }

        res.status(200).json({ message: "Data fetched securely.", success: true, data: userData });
    } catch (err) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}

const updateUserSettings = async (req, res, next) => {

    const finalData = req.body;
    const userId = req.user._id;

    try {

        const updateSettings = await UserModel.findByIdAndUpdate(
            userId,
            { $set: finalData },
            { new: true }
        );

        if (!updateSettings) {
            return res.status(404).json({ message: "Could not update, Try again later.", success: false })
        }

        res.status(200).json({ message: "Settings updated successfully.", success: true, data: updateSettings })
    } catch (err) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}

const getHabitCount = async (req, res, next)=>{

    const userId = req.user._id;
    console.log(userId)

    try{

        const habitCount = await HabitModel.countDocuments({ userId });

        console.log(habitCount)

        if(!habitCount){
            return res.status(400).json({ message: "Could not find User.", success: false })
        }

        res.status(200).json({ message: "Data fetched securely.", success: true, count: habitCount })
    }catch(err){
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}

module.exports = {
    addHabit,
    getHabits,
    updateHabit,
    deleteHabit,
    getUserSettings,
    updateUserSettings,
    getHabitCount
}



// For Put request

// const updateHabit = async (req, res, next) => {
//     const habitId = req.params.id;
//     const { habit, habitDescription, repeat, custom_repeat, startDate, endDate, state } = req.body;

//     try {
//         const updateHabit = await HabitModel.findByIdAndUpdate(
//             habitId,
//             { habit, habitDescription, repeat, custom_repeat, startDate, endDate, state },
//             { new: true }
//         );

//         if (!updateHabit) {
//             return res.status(404).json({ message: "Habit not found. ", success: false })
//         }

//         res.status(200).json({ message: "Habit updated successfully.", success: true, data: updateHabit })
//     } catch (err) {
//         res.status(500).json({ message: "Internal server error", success: false })
//     }
// }