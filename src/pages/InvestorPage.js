import "../assets/styles/InvestorPage.css";

import { useContext, useState } from "react";

import { InvestorCard } from "../components/InvestorCard.js";
import { DataContext } from "../context/DataContext.js";

import { auth, db } from "../services/firebase.js";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";

export function InvestorPage() {
  const { data, setData, userData, hasCompany, setUserData } =
    useContext(DataContext);

  const investors = data?.investors ?? [];
  const areas = data?.area ?? [];

  const [activeFilter, setActiveFilter] = useState([]);

  const [isAddingInvestor, setIsAddingInvestor] = useState(false);

  const toggleFilter = (value) => {
    setActiveFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const filteredInvestors =
    activeFilter.length === 0
      ? investors
      : investors.filter((inv) =>
          inv.area?.some((a) => activeFilter.includes(a)),
        );

  const isMatchingArea = (investor) =>
    userData?.company?.area?.some((area) => investor.area?.includes(area)) &&
    userData?.company?.region?.some((region) =>
      investor.region?.includes(region),
    );

  async function addInvestor(investor) {
    if (isAddingInvestor) return;

    if (!hasCompany) {
      alert("У вас ще немає компанії!");
      return;
    }

    if (!isMatchingArea(investor)) {
      alert("Сфера діяльності або регіон не збігаються з цим інвестором.");
      return;
    }

    if (userData.company.investors.includes(investor.id)) {
      alert("Ви вже залучили інвестиції від цього фонду.");
      return;
    }

    if (userData.company.myCompanyPart - investor.averageCheckPercent < 50) {
      alert(
        "Неможливо залучити інвестицію: ваша частка компанії впаде нижче 50%!",
      );
      return;
    }

    if (investor.budget < investor.check) {
      alert("На жаль, у цього інвестора вичерпано бюджет для нових чеків.");
      return;
    }

    setIsAddingInvestor(true);

    const userRef = doc(db, "users", auth.currentUser.uid);
    const investorRef = doc(db, "investors", String(investor.id));

    try {
      await updateDoc(userRef, {
        "company.myCompanyPart": increment(-investor.averageCheckPercent),
        "company.balance": increment(investor.check),
        "company.investors": arrayUnion(investor.id),
      });

      await updateDoc(investorRef, {
        budget: increment(-investor.check),
      });

      setUserData((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          myCompanyPart:
            prev.company.myCompanyPart - investor.averageCheckPercent,
          balance: prev.company.balance + investor.check,
          investors: [...prev.company.investors, investor.id],
        },
      }));

      setData((prev) => ({
        ...prev,
        investors: prev.investors.map((inv) =>
          inv.id === investor.id
            ? { ...inv, budget: inv.budget - investor.check }
            : inv,
        ),
      }));

      alert(`Успіх! Ви залучили $${investor.check} від ${investor.title}.`);
    } catch (error) {
      alert("Помилка оновлення інвестора: " + error.message);
      console.error("Помилка оновлення інвестора: ", error);
    } finally {
      setIsAddingInvestor(false);
    }
  }

  return (
    <main className="wrapper">
      <section className="investors-section">
        <div className="content">
          <div className="filter-list-container">
            <h3>Фільтр</h3>
            <ul className="filter-list">
              {areas.map((area) => (
                <li key={area}>
                  <button
                    type="button"
                    className={`button ${activeFilter.includes(area) ? "green" : ""}`}
                    onClick={() => toggleFilter(area)}
                  >
                    {area}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="investor-list-container">
            <h3 className="investors-title">Інвестори</h3>
            <ul className="investor-list">
              {filteredInvestors.length === 0 ? (
                <li>Немає за фільтрами</li>
              ) : (
                filteredInvestors.map((investor) => (
                  <InvestorCard
                    key={investor.id}
                    investor={investor}
                    userData={userData}
                    hasCompany={hasCompany}
                    isMatchingArea={isMatchingArea}
                    onAddInvestor={addInvestor}
                  />
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
