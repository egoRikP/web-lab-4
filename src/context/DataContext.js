import { createContext, useState, useEffect } from "react";

import { auth, db } from "../services/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState({
    area: [],
    region: [],
    markets: [],
    investors: [],
    users: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!userData;
  const hasCompany =
    isLoggedIn && userData.company && Object.keys(userData.company).length > 0;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      getDoc(doc(db, "users", user.uid))
        .then((userData) => {
          if (userData.exists()) {
            setUserData(userData.data());
          } else {
            console.log("no data exists");
          }
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setIsLoading(false);
        });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDoc(doc(db, "areas", "list"))
      .then((e) => {
        if (e.exists()) setData((prev) => ({ ...prev, area: e.data().items }));
      })
      .catch((error) => console.log(error));

    getDoc(doc(db, "regions", "list"))
      .then((e) => {
        if (e.exists())
          setData((prev) => ({ ...prev, region: e.data().items }));
      })
      .catch((error) => console.log(error));

    getDocs(collection(db, "investors"))
      .then((snapshot) => {
        const investorsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData((prev) => ({
          ...prev,
          investors: investorsList,
        }));
      })
      .catch((error) => console.log(error));

    getDocs(collection(db, "markets"))
      .then((snapshot) => {
        const marketsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData((prev) => ({ ...prev, markets: marketsList }));
      })
      .catch((error) => console.log(error));

    getDocs(collection(db, "users"))
      .then((allUsers) => {
        const usersList = allUsers.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData((prev) => ({ ...prev, users: usersList }));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <DataContext.Provider
      value={{
        isLoading,
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
