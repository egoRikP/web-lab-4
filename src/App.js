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

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-startup" element={<CreateStartupPage />} />
            <Route path="/investors" element={<InvestorPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/my-startup" element={<MyStartupPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
