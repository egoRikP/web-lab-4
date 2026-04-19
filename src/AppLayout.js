import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { DataContext } from "./context/DataContext";
import { Loader } from "./components/Loader";

export function AppLayout() {
  const { isLoading } = useContext(DataContext);

  if (isLoading) {
    return <Loader />;
  }

  return <Outlet />;
}
