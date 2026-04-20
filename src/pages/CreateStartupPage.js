import "../assets/styles/CreateStartupPage.css";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../context/DataContext.js";

import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase.js";

export function CreateStartupPage() {
  const {
    data,
    userData,
    isLoggedIn,
    hasCompany,
    setUserData,
    getAreas,
    getRegions,
  } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasCompany) {
      navigate("/my-startup");
    }
  }, [hasCompany]);

  useEffect(() => {
    getAreas();
    getRegions();
  }, []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    area: [],
    region: [],
  });

  const handleChange = (e) => {
    const { name, value, options, multiple } = e.target;

    if (multiple) {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setForm({
        ...form,
        [name]: selectedValues,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      Object.values(form).some((v) => {
        if (Array.isArray(v)) {
          return v.length == 0;
        }
        return v.trim() == "";
      })
    ) {
      alert("Заповни всі поля!");
      return;
    }

    const newCompany = {
      title: form.title,
      description: form.description,
      area: form.area,
      region: form.region,
      offices: 0,
      maxEmpoyeesPerOffice: 5,
      empoyees: 0,
      myCompanyPart: 100,
      monthProfit: 0,
      monthCosts: 0,
      balance: 0,
      myMarkets: [],
      investors: [],
      monthHistory: [],
    };

    updateDoc(doc(db, "users", auth.currentUser.uid), { company: newCompany })
      .then(() => {
        setUserData((prev) => ({
          ...prev,
          company: newCompany,
        }));
        navigate("/my-startup");
      })
      .catch((error) => {
        console.error("Помилка створення компанії: ", error);
      });
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <main className="wrapper">
      <section id="startup" className="startup-section">
        <form
          className="startup-form"
          id="startup-form"
          onSubmit={handleSubmit}
        >
          <h3 className="startup-title">Створення власної компанії</h3>
          <div className="startup-form-content">
            <div className="startup-form-item">
              <label className="startup-form-label" htmlFor="company">
                Назва:
              </label>
              <input
                required
                className="startup-form-input"
                name="title"
                value={form.title}
                placeholder="Наприклад, ViTEk"
                onChange={handleChange}
              />
            </div>

            <div className="startup-form-item">
              <label className="startup-form-label" htmlFor="description">
                Опис:
              </label>
              <textarea
                required
                className="startup-form-input"
                placeholder="Опис про компанію"
                name="description"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="startup-form-item">
              <label className="startup-form-label" htmlFor="field">
                Сфера діяльності:
              </label>
              <select
                required
                id="field-form"
                className="startup-form-input"
                name="area"
                multiple
                value={form.area}
                onChange={handleChange}
              >
                <option disabled>Виберіть сфери діяльності</option>
                {data &&
                  data.area &&
                  data.area.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
              </select>
            </div>

            <div className="startup-form-item">
              <label className="startup-form-label" htmlFor="region">
                Регіон:
              </label>
              <select
                required
                id="region-form"
                className="startup-form-input"
                name="region"
                multiple
                value={form.region}
                onChange={handleChange}
              >
                <option disabled>Виберіть регіони</option>
                {data &&
                  data.region &&
                  data?.region.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button className="button green">Створити</button>
        </form>
      </section>
    </main>
  );
}
