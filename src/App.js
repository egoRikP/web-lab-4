import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext.js";

import NavigationBar from "../src/components/NavigationBar.js";
import Footer from "../src/components/Footer.js";

import { MainPage } from "./pages/MainPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { CreateStartupPage } from "./pages/CreateStartupPage.js";
import { InvestorPage } from "./pages/InvestorPage.js";
import { MarketPage } from "./pages/MarketPage.js";
import { MyStartupPage } from "./pages/MyStartupPage.js";

import { ProtectedRoute } from "./routes/ProtectedRoute.js";

import { AppLayout } from "./AppLayout.js";

function App() {
  return (
    <DataProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/investors" element={<InvestorPage />} />
            <Route path="/market" element={<MarketPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/create-startup" element={<CreateStartupPage />} />
              <Route path="/my-startup" element={<MyStartupPage />} />
            </Route>
          </Route>
        </Routes>
        <Footer />
      </Router>
    </DataProvider>
  );
}

export default App;
