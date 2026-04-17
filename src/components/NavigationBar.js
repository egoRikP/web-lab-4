import "../assets/styles/NavigationBar.css";

import logo from "../assets/images/logo-icon.png";
import startupIcon from "../assets/images/startup-icon.png";
import marketIcon from "../assets/images/market-icon.png";
import investorIcon from "../assets/images/investor-icon.png";

import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { DataContext } from "../context/DataContext";

export default function NavigationBar() {
  const { isLoggedIn, setUserData } = useContext(DataContext);

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  function logout() {
    setUserData(null);
    localStorage.removeItem(`user`);
    navigate("/");
  }

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <header className="header wrapper">
      <Link to={"/"} className="header-main">
        <img className="header-logo" src={logo} alt="Логотип Startup" />
        <span className="header-text">Startup</span>
      </Link>

      <button className="burger" aria-label="Меню" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navigation ${isOpen ? "open" : ""}`}>
        <ul className="navigation-list">
          <li>
            <Link to={"/my-startup"} className="navigation-item">
              <img className="navigation-icon" src={startupIcon} alt="" />
              <span className="navigation-text">Мій стартап</span>
            </Link>
          </li>
          <li>
            <Link to="/market" className="navigation-item">
              <img className="navigation-icon" src={marketIcon} alt="" />
              <span className="navigation-text">Ринок</span>
            </Link>
          </li>
          <li>
            <Link to="/investors" className="navigation-item">
              <img className="navigation-icon" src={investorIcon} alt="" />
              <span className="navigation-text">Інвестори</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className={`auth ${isOpen ? "open" : ""}`}>
        {isLoggedIn ? (
          <button className="button red" onClick={logout}>
            Вихід
          </button>
        ) : (
          <>
            <Link className="auth-item" to="/register">
              Реєстрація
            </Link>
            <Link className="auth-item" to="/login">
              Вхід
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
