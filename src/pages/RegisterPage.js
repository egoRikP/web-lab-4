import "../assets/styles/RegisterPage.css";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../context/DataContext.js";

export function RegisterPage() {
  const { data, setData, isLoggedIn, setUserData } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/my-startup");
    }
  });

  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    repeatPassword: "",
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

    if (form.password !== form.repeatPassword) {
      alert("Паролі не співпадають!");
      return;
    }

    if (data.users.some((u) => u.email === form.email)) {
      alert("Такий юзер вже є!");
      return;
    }

    const newUser = {
      nickname: form.nickname,
      email: form.email,
      password: form.password,
      company: {},
    };

    const newData = {
      ...data,
      users: [...data.users, newUser],
    };

    setData(newData);
    setUserData(newUser);

    navigate("/my-startup");
  };

  return (
    <main className="wrapper">
      <section id="register" className="register-section">
        <form
          className="register-form"
          id="register-form"
          onSubmit={handleSubmit}
        >
          <h3 className="register-title">Реєстрація користувача</h3>
          <div className="register-form-content">
            <div className="register-item">
              <label className="register-label" htmlFor="nickname">
                Нікнейм:
              </label>
              <input
                required
                className="register-input"
                name="nickname"
                placeholder="Наприклад, egorik"
                onChange={handleChange}
              />
            </div>

            <div className="register-item">
              <label className="register-label" htmlFor="email">
                Емейл:
              </label>
              <input
                required
                className="register-input"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                onChange={handleChange}
              />
            </div>

            <div className="register-item">
              <label className="register-label" htmlFor="password">
                Пароль:
              </label>
              <input
                required
                className="register-input"
                name="password"
                type="password"
                placeholder="1234****"
                minLength="8"
                maxLength="16"
                onChange={handleChange}
              />
            </div>

            <div className="register-item">
              <label className="register-label" htmlFor="repeat-password">
                Повторіть пароль:
              </label>
              <input
                required
                className="register-input"
                name="repeatPassword"
                type="password"
                placeholder="1234****"
                minLength="8"
                maxLength="16"
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="button green">Зареєструватись!</button>
        </form>
      </section>
    </main>
  );
}
