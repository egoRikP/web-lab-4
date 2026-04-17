import "../assets/styles/Footer.css";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer wrapper">
      <div className="footer-content">
        <nav className="footer-navigation">
          <ul className="footer-navigation-list">
            <li>
              <Link to="/my-startup">Мій стартап</Link>
            </li>
            <li>
              <Link to="/market">Ринок</Link>
            </li>
            <li>
              <Link to="/investors">Інвестори</Link>
            </li>
          </ul>
        </nav>

        <address className="footer-address">
          <ul className="footer-address-list">
            <li>Львів, вул. Степана Бандери, 12</li>
            <li>
              <a href="tel:+380321234567">+38 (032) 123-45-67</a>
            </li>
            <li>
              <a href="mailto:startup@simulator.test">startup@simulator.test</a>
            </li>
          </ul>
        </address>
      </div>

      <div className="footer-author">
        <p>© 2026 Startup Simulator, Ihor Palyha. Всі права захищено.</p>
      </div>
    </footer>
  );
}
