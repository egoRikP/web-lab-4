import { createContext, useState, useEffect } from "react";
import { loadJson } from "../services/api.js";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);

  const isLoggedIn = !!userData;
  const hasCompany =
    isLoggedIn && userData.company && Object.keys(userData.company).length > 0;

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      loadJson().then((data) => {
        setData(data);
      });
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!userData) {
      return;
    }
    localStorage.setItem("user", JSON.stringify(userData));

    if (data) {
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.email === userData.email ? userData : u,
        ),
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (data) {
      console.log("Data", data);
      localStorage.setItem("data", JSON.stringify(data));
    }
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        userData,
        setUserData,
        isLoggedIn,
        hasCompany,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
