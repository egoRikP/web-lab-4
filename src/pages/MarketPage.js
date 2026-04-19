import "../assets/styles/MarketPage.css";

import fieldIcon from "../assets/images/field-icon.png";

import { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";

import { MarketCard } from "../components/MarketCard";
import { CompetitorCard } from "../components/CompetitorCard";

import { auth, db } from "../services/firebase";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";

export function MarketPage() {
  const { userData, hasCompany, data, setUserData } = useContext(DataContext);

  const competitors = data?.users ?? [];

  const [isTakingMarket, setIsTakingMarket] = useState(false);

  const [activeFilter, setActiveFilter] = useState([]);

  const clearFilter = () => {
    setActiveFilter([]);
  };

  const toggleFilter = (value) => {
    setActiveFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const filteredCompetitors = competitors.filter((c) => {
    return (
      c.company &&
      Object.keys(c.company).length > 0 &&
      (activeFilter.length === 0 ||
        c.company.area?.some((a) => activeFilter.includes(a)))
    );
  });

  function getCompetitorShare(competitor) {
    let compStrength = competitor.company.empoyees + competitor.company.offices;

    let totalMarketStrength = data.users
      .filter((c) => c.company && Object.keys(c.company).length !== 0)
      .filter((c) => {
        let isSameArea = c.company.area?.some((a) =>
          competitor.company.area?.includes(a),
        );
        let isSameRegion = c.company.region?.some((r) =>
          competitor.company.region?.includes(r),
        );
        return isSameArea && isSameRegion;
      })
      .reduce((sum, c) => sum + (c.company.empoyees + c.company.offices), 0);

    return totalMarketStrength > 0
      ? +((compStrength / totalMarketStrength) * 100).toFixed(1)
      : 0;
  }

  function isMyCategory(market) {
    return (
      market.area.some((e) => (userData?.company?.area || []).includes(e)) &&
      market.region.some((e) => (userData?.company?.region || []).includes(e))
    );
  }

  function isMyMarket(market) {
    return userData && userData.company.myMarkets?.includes(market.id);
  }

  function takeMarket(market) {
    if (
      isTakingMarket ||
      !hasCompany ||
      !isMyCategory(market) ||
      userData.company.myMarkets.includes(market.id) ||
      market.averageCheckPercent > userData.company.myCompanyPart ||
      userData.company.balance - market.startSum < 0
    ) {
      return;
    }

    setIsTakingMarket(true);
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      "company.balance": increment(-market.startSum),
      "company.monthCosts": increment(market.monthPayment),
      "company.myMarkets": arrayUnion(market.id),
    })
      .then((data) => {
        console.log(data);
        setUserData((prev) => ({
          ...prev,
          company: {
            ...prev.company,
            balance: prev.company.balance - market.startSum,
            monthCosts: prev.company.monthCosts + market.monthPayment,
            myMarkets: [...prev.company.myMarkets, market.id],
          },
        }));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsTakingMarket(false);
      });
  }

  return (
    <main className="wrapper">
      <section>
        <div className="dashboard-section">
          <h3 className="dashboard-title">Тренди</h3>
          <ul className="cards-list">
            <li className="card-item">
              <div className="card-row flex-between">
                <div className="icon-text">
                  <img src={fieldIcon} alt="Field" />
                  <div>
                    <span className="label">Сфера</span>
                    <p className="value">IT</p>
                  </div>
                </div>
                <div className="stat-block right-align">
                  <h4 className="label">Популярність</h4>
                  <p className="green">+5%</p>
                </div>
              </div>
              <div className="card-row grid-2">
                <div className="stat-block">
                  <h4 className="label">середній %</h4>
                  <p className="value">10%</p>
                </div>
                <div className="stat-block">
                  <h4 className="label">інвестиції</h4>
                  <p className="green">$50K</p>
                </div>
              </div>
            </li>

            <li className="card-item">
              <div className="card-row flex-between">
                <div className="icon-text">
                  <img src={fieldIcon} alt="Field" />
                  <div>
                    <span className="label">Сфера</span>
                    <p className="value">IT</p>
                  </div>
                </div>
                <div className="stat-block right-align">
                  <h4 className="label">Популярність</h4>
                  <p className="green">+5%</p>
                </div>
              </div>
              <div className="card-row grid-2">
                <div className="stat-block">
                  <h4 className="label">середній %</h4>
                  <p className="value">10%</p>
                </div>
                <div className="stat-block">
                  <h4 className="label">інвестиції</h4>
                  <p className="green">$50K</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="dashboard-section">
          <h3 className="dashboard-title">Ринки збуту</h3>
          <ul className="market-list cards-list" id="market-list">
            {data?.markets.map((market) => (
              <MarketCard
                className=""
                key={market.id}
                market={market}
                canTakeMarket={!hasCompany}
                isMyMarket={isMyMarket(market)}
                isMyCategory={isMyCategory(market)}
                takeMarket={() => takeMarket(market)}
              />
            ))}
          </ul>
        </div>

        <h3 className="dashboard-title">Конкуренти</h3>
        <div className="dashboard-section content">
          <div>
            <h3>Фільтр</h3>

            <ul className="filter-list">
              <button
                className={`button ${activeFilter.length > 0 ? "red" : ""}`}
                onClick={clearFilter}
              >
                Очистити
              </button>
              <hr />
              <h4>Сфера діяльності</h4>
              {data?.area.map((area) => (
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

          <div className="competitor-list-container">
            {filteredCompetitors.length === 0 ? (
              <p>Немає за фільтрами</p>
            ) : (
              <ul className="cards-list" id="competitor-list">
                {filteredCompetitors.map((competitor) => (
                  <CompetitorCard
                    key={competitor.email}
                    competitor={competitor}
                    share={getCompetitorShare(competitor)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
