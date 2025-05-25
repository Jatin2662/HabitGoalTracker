import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


function ProtectedRoutes({ allowedRoles }) {

    const user = localStorage.getItem('loggedInUser');
    // const role = localStorage.getItem('role');
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token);
    // console.log(decoded);
    const userRole = decoded.role;

    if (!user || !userRole || !token) {
        return <Navigate to="/auth/login" />
    } else if (!allowedRoles.includes(userRole)) {
        return <Navigate to='/unauthorized' />
    }
    return <Outlet />
}

export default ProtectedRoutes;