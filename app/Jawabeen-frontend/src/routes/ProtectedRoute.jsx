import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, role, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
