import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/auth";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import Register from "./pages/Auth/Register";
import RequireAuth from "./components/RequireAuth";
import { AddTodo } from "./pages/AddTodo";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

const AppRoutes = () => {
  const { auth } = useAuth();
  return (
    <Routes>
      <Route path="/" element={!auth ? <Login /> : <Home />} />
      <Route
        path="/signup"
        element={auth ? <Navigate to="/" /> : <Register />}
      />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />

      <Route element={<RequireAuth />}>
        <Route path="/home" element={<Home />} />
        <Route path="/addTodo" element={<AddTodo />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
