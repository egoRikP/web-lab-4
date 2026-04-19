import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { DataContext } from "../context/DataContext";

export function ProtectedRoute() {
  const { isLoggedIn } = useContext(DataContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
