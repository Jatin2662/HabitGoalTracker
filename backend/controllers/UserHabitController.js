const HabitLogModel = require("../models/HabitLogModel");
const HabitModel = require("../models/HabitModel");
const UserModel = require("../models/UserModel");




function generateHabitLogs(habitLog) {
    const { repeat, custom_repeat, startDate, endDate } = habitLog;

    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const repeatDays = (custom_repeat || []).map(day => dayMap[day]);
    const logs = [];

    const start = new Date(startDate);

    //   const defaultEnd = new Date(start);
    // defaultEnd.setMonth(defaultEnd.getMonth() + 1); // 1 month range
    // const end = endDate ? new Date(endDate) : defaultEnd;

    const getDaysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate(); // new change
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + getDaysInMonth * 86400000); // replaced 30 with new change

    for (let current = new Date(start); current <= end;) {
        const day = current.getDay();
        let include = false;

        switch (repeat) {
            case 'daily':
                include = true; break;
            case 'weekly':
                include = day === start.getDay(); break;
            case 'monthly':
                include = current.getDate() === start.getDate(); break;
            case 'weekdays':
                include = day >= 1 && day <= 5; break;
            case 'weekends':
                include = day === 0 || day === 6; break;
            case 'custom':
                include = repeatDays.includes(day); break;
        }

        if (include) {
            logs.push({
                userId: habitLog.userId,
                habitId: habitLog._id,
                habit: habitLog.habit,
                habitDescription: habitLog.habitDescription,
                date: new Date(current),
                status: 'pending'
            });
        }
        current.setDate(current.getDate() + 1);
    }

    return logs;
}


const addHabit = async (req, res, next) => {

    const { habit, habitDescription, repeat, custom_repeat, startDate, endDate, state } = req.body;
    const userId = req.user._id;

    try {

        const newHabit = new HabitModel({ userId, habit, habitDescription, repeat, custom_repeat, startDate, endDate: endDate || null, state });
        await newHabit.save()

        const logs = generateHabitLogs(newHabit);

        await HabitLogModel.insertMany(logs);

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



const getDashboardData = async (req, res, next) => {

    const userId = req.user._id;
    // console.log(userId)

    try {


        // Each Habit Status
        const habits = await HabitModel.find({ userId });

        const habitStats = await Promise.all(habits.map(async (habit) => {
            const logs = await HabitLogModel.find({ habitId: habit._id });

            const totalLogs = logs.length;
            const completedLogs = logs.filter(log => log.status === 'completed').length;
            const completionRate = totalLogs > 0 ? (completedLogs / totalLogs * 100).toFixed(2) : '0.00';

            return {
                habitId: habit._id,
                habit: habit.habit,
                habitDescription: habit.habitDescription,
                totalLogs,
                completedLogs,
                completionRate: parseFloat(completionRate)
            };
        }));

        // console.log(habitStats)


        // Total Habits
        const uniqueHabitCount = await HabitModel.countDocuments({ userId });

        // Overall Completion Rate
        const HabitLogs = await HabitLogModel.find({ userId });

        const isCompleted = (log) => {
            if (log.status == 'completed') {
                return true
            }
            return false
        }

        const comp = HabitLogs.filter(isCompleted).length;
        const total = HabitLogs.length;

        const overallCompletionRate = total > 0 ? ((comp / total) * 100).toFixed(2) : '0.00';

        // Today's Progress
        // console.log(HabitLogs)

        const todayHabits = HabitLogs.filter((habit) => {
            const todayDate = new Date().toISOString().split('T')[0];
            // console.log(todayDate);

            if (habit.updatedAt.toISOString().split('T')[0] == todayDate && habit.status == 'completed') {
                return true;
            }
        })

        const todayProgress = todayHabits.length;

        // Streak Work

        const NormalizeInUTC = (date) => {
            const d = new Date(date);
            d.setUTCHours(0, 0, 0, 0)

            return d;
        }
        const logs = await HabitLogModel.find({ userId });

        // console.log(logs)

        const recievedDates = logs
            .filter(log => log.status == 'completed')
            .map((log) => {
                return log.updatedAt;
            })
            .sort((a, b) => new Date(b) - new Date(a));
        // console.log("Recieved dates: ",recievedDates)

        const uniqueDates = new Set(
            recievedDates.map(date => {
                const d = new Date(date);

                return d;
            })
        )

        const dayStreak = [];
        for (const element of uniqueDates) {
            dayStreak.push(element)
        }

        // console.log("Day streak: ", dayStreak)
        const todayDate = NormalizeInUTC(new Date());
        let streak = 0;

        for(let i = 0; i < dayStreak.length;){
            const d = NormalizeInUTC(dayStreak[i]);

            if(todayDate.getTime() === d.getTime()){
                streak++;

                todayDate.setDate(todayDate.getDate() - 1);
            }else{
                break;
            }
        }

        // console.log(streak)

        if (!uniqueHabitCount) {
            return res.status(400).json({ message: "Could not find User.", success: false })
        }

        res.status(200).json({
            message: "Data fetched securely.",
            success: true,
            count: uniqueHabitCount,
            overallCompletionRate: overallCompletionRate,
            habitStats: habitStats,
            todayProgress: todayProgress,
            streak: streak
        })

    } catch (err) {
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
    getDashboardData
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