import "../assets/styles/MainPage.css";

import { Link } from "react-router-dom";

export function MainPage() {
  return (
    <main className="wrapper">
      <section className="hero-section">
        <h3 className="hero-text">
          Створи власну компанію та стань лідером ринку!
        </h3>
        <Link className="button green" to="/create-startup">
          Розпочати вже зараз!
        </Link>

        <div className="how-to-start">
          <h3 className="how-to-start-title">Як розпочати?</h3>
          <ul className="how-to-start-list">
            <li className="how-to-start-element">
              <h3 className="how-to-start-number">1</h3>
              <p className="how-to-start-text">Створи компанію</p>
            </li>
            <li className="how-to-start-element">
              <h3 className="how-to-start-number">2</h3>
              <p className="how-to-start-text">Аналізуй ринок</p>
            </li>
            <li className="how-to-start-element">
              <h3 className="how-to-start-number">3</h3>
              <p className="how-to-start-text">Залучай інвесторів</p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
