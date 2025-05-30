
import { MdSpaceDashboard } from "react-icons/md";
import { GiMeditation } from "react-icons/gi";
import { MdOutlineGpsFixed } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { FaUserSecret } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";


const userMenuItems = [
    {
        id: 1,
        title: 'Dashboard',
        path: '/user/user-dashboard',
        icon: <MdSpaceDashboard />
    },
    {
        id: 2,
        title: 'Habits',
        path: '/user/user-habits',
        icon: <GiMeditation />
    },
    {
        id: 3,
        title: 'Track',
        path: '/user/user-track',
        icon: <MdOutlineGpsFixed />
    },
    {
        id: 4,
        title: 'Settings',
        path: '/user/user-settings',
        icon: <IoSettings />
    }
]


const adminMenuItems = [
    {
        id: 1,
        title: 'Dashboard',
        path: '/admin/admin-dashboard',
        icon: <FaUserSecret />
    },
    {
        id: 2,
        title: 'Users',
        path: '/admin/admin-users',
        icon: <FaUsers />
    },
]

export {
    userMenuItems,
    adminMenuItems
}