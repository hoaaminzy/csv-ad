import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import DashboardAdmin from "./Sidebar";

const AppRoutes = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated ? <DashboardAdmin /> : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
