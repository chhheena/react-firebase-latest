import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import PublicRoute from "./PublicLayout";

import UserList from "../pages/admin/User/Index";
import CoffeeShopList from "../pages/admin/CoffeeShop/Index";
import QuestionList from "../pages/admin/Question/Index";
import AddQuestion from "../pages/admin/Question/Add";
import QuestionCategoryList from "../pages/admin/Question/Category/Index";




const AppRoutes = ({ user }) => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

        {/* Protected Routes (User/Admin) */}
        <Route>
          {/* Example: <Route path="/profile" element={<Profile />} /> */}
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute user={user} role="admin" allowedRoles={["admin"]} />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="user-list" element={<UserList />} />
            <Route path="coffee-shop-list" element={<CoffeeShopList />} />
            
            <Route path="questions" element={<QuestionList />} />
            <Route path="add-question" element={<AddQuestion />} />
            <Route path="question-categories" element={<QuestionCategoryList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
