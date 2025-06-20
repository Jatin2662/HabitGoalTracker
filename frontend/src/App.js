

import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "./redux/slice/toastSlice";
import Root from './pages/Root';
import PrivacyPage from './pages/Privacy';
import TermsConditions from './pages/TermsConditions';
import Auth from './pages/Auth';
import LogIn from './components/Login';
import SignUp from './components/Signup';
import Unauthorized from './components/Unauthorized';
import ProtectedRoutes from './components/Authorization';
// import UserHome from './pages/user/UserHome';
import UserDashboard from './pages/user/UserDashboard';
import UserHabits from './pages/user/UserHabits';
import UserSettings from './pages/user/UserSettings';
import Toast from "./components/Toast";
import ScrollToTop from './components/ScrollToTop';
// import AdminHome from './pages/admin/AdminHome';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCustomEmail from './pages/admin/AdminCustomEmail';
// import Home from './pages/Home';
import MainHome from './pages/MainHome';
import Loader from './components/Loader';
import UserToday from './pages/user/UserToday';
import { lazy, Suspense } from 'react';
import EmailVerification from './components/EmailVerification';
import ResetPassword from './components/ResetPassword';

const UserTrack = lazy(() => import('./pages/user/UserTrack'))


function App() {

  const { visible, message, type } = useSelector((state) => state.toast);
  const { hidden, text } = useSelector((state) => state.loader);
  const dispatch = useDispatch();

  return (
    <>
      {visible && (
        <Toast
          message={message}
          type={type}
          onClose={() => dispatch(hideToast())}
        />
      )}
      {hidden && (
        <Loader text={text} />
      )}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms&conditions" element={<TermsConditions />} />

        <Route path="/auth" element={<Auth />}>
          <Route index element={<LogIn />} />
          <Route path="login" element={<LogIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="verify/:token?" element={<EmailVerification />} />
          <Route path="reset-password/:token?" element={<ResetPassword />} />
        </Route>

        <Route path='/user' element={<ProtectedRoutes allowedRoles={['user', 'admin']} />} >
          <Route element={<MainHome />}>
            {/* <Route index element={<UserDashboard />} /> */}
            <Route index element={<Navigate to="user-dashboard" />} />
            <Route path="user-dashboard" element={<UserDashboard />} />
            <Route path="user-habits/:habitId?" element={<UserHabits />} />
            <Route path="user-today" element={<UserToday />} />
            <Route path="user-track"
              element={
                <Suspense fallback={<Loader text="Loading Track..." />}>
                  <UserTrack />
                </Suspense>
              } />
            <Route path="user-settings" element={<UserSettings />} />

          </Route>
        </Route>

        <Route path="/admin" element={<ProtectedRoutes allowedRoles={['admin']} />} >
          <Route element={<MainHome />}>
            <Route index element={<Navigate to="admin-dashboard" />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="admin-users" element={<AdminUsers />} />
            < Route path="admin-setCustomEmail" element={<AdminCustomEmail />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes >
    </>
  );
}

export default App;
