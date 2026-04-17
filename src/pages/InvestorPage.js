import "../assets/styles/InvestorPage.css";

import { useContext, useState } from "react";

import { InvestorCard } from "../components/InvestorCard.js";
import { DataContext } from "../context/DataContext.js";

export function InvestorPage() {
  const { data, userData, hasCompany, setUserData } = useContext(DataContext);

  const investors = data?.investors ?? [];
  const areas = data?.area ?? [];

  const [activeFilter, setActiveFilter] = useState([]);

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

  function addInvestor(investor) {
    if (
      !hasCompany ||
      !isMatchingArea(investor) ||
      userData.company.investors.includes(investor.id) ||
      userData.company.myCompanyPart <= 50
    ) {
      return;
    }

    setUserData({
      ...userData,
      company: {
        ...userData.company,
        myCompanyPart:
          userData.company.myCompanyPart - investor.averageCheckPercent,
        balance: userData.company.balance + investor.check,
        investors: [...userData.company.investors, investor.id],
      },
    });
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
