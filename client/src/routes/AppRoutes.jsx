import { Route, Routes } from "react-router-dom";

import Landing from "../Landing";
import AppLayout from "../layouts/AppLayout";
import Analytics from "../pages/Analytics";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Category from "../pages/Category";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/category" element={<Category />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
