import "../assets/styles/LoginPage.css";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../context/DataContext.js";

export function LoginPage() {
  const { data, isLoggedIn, setUserData } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/my-startup");
    }
  });

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(form).some((v) => v.trim() === "")) {
      alert("Заповни всі поля!");
      return;
    }

    const user = data.users.find((u) => u.email === form.email);

    if (!user) {
      alert("Такого юзера немає!");
      return;
    }

    if (user.password != form.password) {
      alert("Неправильний пароль!");
      return;
    }

    setUserData(user);
    navigate("/my-startup");
  };

  return (
    <main className="wrapper">
      <section id="login" className="login-section">
        <form className="login-form" id="login-form" onSubmit={handleSubmit}>
          <h3 className="login-title">Вхід користувача</h3>
          <div className="login-form-content">
            <div className="login-item">
              <label className="login-label" htmlFor="email">
                Емейл:
              </label>
              <input
                required
                className="login-input"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                onChange={handleChange}
              />
            </div>

            <div className="login-item">
              <label className="login-label" htmlFor="password">
                Пароль:
              </label>
              <input
                required
                className="login-input"
                name="password"
                type="password"
                placeholder="1234****"
                minLength="8"
                maxLength="16"
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="button green">Увійти</button>
        </form>
      </section>
    </main>
  );
}
