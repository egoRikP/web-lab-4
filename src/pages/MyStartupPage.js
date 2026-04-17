import "../assets/styles/MyStartupPage.css";

import fieldIcon from "../assets/images/field-icon.png";
import regionIcon from "../assets/images/region-icon.png";

import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../context/DataContext.js";

import { MyInvestorRow } from "../components/MyInvestorRow.js";
import { MyMarketRow } from "../components/MyMarketRow.js";
import { asList } from "../utils/renderUtils";

import { LoginOrRegister } from "../components/LoginOrRegister.js";

import Chart from "chart.js/auto";

export function MyStartupPage() {
  const { data, setData, userData, isLoggedIn, hasCompany, setUserData } =
    useContext(DataContext);

  function isEnoughtMoney(need) {
    return userData.company.balance >= need;
  }

  function addOffice() {
    if (!isEnoughtMoney(1500)) {
      return;
    }

    setUserData({
      ...userData,
      company: {
        ...userData.company,
        balance: userData.company.balance - 1500,
        monthCosts: userData.company.monthCosts + 1500,
        offices: userData.company.offices + 1,
      },
    });
  }

  function removeOffice() {
    if (
      userData.company.offices <= 0 ||
      userData.company.offices * userData.company.maxEmpoyeesPerOffice -
        userData.company.empoyees <
        userData.company.maxEmpoyeesPerOffice
    ) {
      return;
    }

    setUserData({
      ...userData,
      company: {
        ...userData.company,
        monthCosts: userData.company.monthCosts - 1500,
        offices: userData.company.offices - 1,
      },
    });
  }

  function addEmployee() {
    if (
      !isEnoughtMoney(500) ||
      userData.company.offices * userData.company.maxEmpoyeesPerOffice -
        userData.company.empoyees <=
        0
    ) {
      return;
    }

    setUserData({
      ...userData,
      company: {
        ...userData.company,
        balance: userData.company.balance - 500,
        monthCosts: userData.company.monthCosts + 500,
        empoyees: userData.company.empoyees + 1,
      },
    });
  }

  function removeEmployee() {
    if (userData.company.empoyees <= 0) {
      return;
    }

    setUserData({
      ...userData,
      company: {
        ...userData.company,
        monthCosts: userData.company.monthCosts - 500,
        empoyees: userData.company.empoyees - 1,
      },
    });
  }

  const myMarkets = data?.markets.filter((element) =>
    (userData?.company?.myMarkets || []).includes(element.id),
  );

  const myInvestors = data?.investors.filter((element) =>
    (userData?.company?.investors || []).includes(element.id),
  );

  function getValidCompetitors() {
    return data.users.filter(
      (c) => c !== userData && c.company && Object.keys(c.company).length > 0,
    );
  }

  const share = (investor) =>
    (userData?.company?.balance || 0) * (investor.averageCheckPercent / 100);

  function getMyMarketShare(marketIndex) {
    let myStrength = userData.company.empoyees + userData.company.offices;
    let competitorsStrength = getValidCompetitors()
      .filter((c) => c.company.myMarkets?.includes(marketIndex))
      .reduce((sum, c) => sum + (c.company.empoyees + c.company.offices), 0);

    let totalStrength = myStrength + competitorsStrength;
    return totalStrength > 0
      ? ((myStrength / totalStrength) * 100).toFixed(1)
      : 100;
  }

  function leaveMarket(market) {
    if (!userData) return;

    const newMyMarkets = userData.company.myMarkets.filter(
      (id) => id !== market.id,
    );

    const targetMarket = data.markets.find((m) => m.id === market.id);

    setUserData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        myMarkets: newMyMarkets,
        monthCosts: prev.company.monthCosts - (targetMarket?.monthPayment || 0),
      },
    }));
  }

  function nextMonth() {
    let totalIncome = 0;
    const company = userData.company;
    const myStrength = company.empoyees + company.offices;
    const validCompetitors = getValidCompetitors();

    const updatedMarkets = data.markets.map((market) => {
      if (!company.myMarkets.includes(market.id)) return market;

      const competitorsStrength = validCompetitors
        .filter((c) => c.company.myMarkets?.includes(market.id))
        .reduce((sum, c) => sum + (c.company.empoyees + c.company.offices), 0);

      const totalStrength = myStrength + competitorsStrength;
      const myShare = totalStrength > 0 ? myStrength / totalStrength : 1;
      const penetrationRate = Math.min(0.001 + myStrength * 0.0005, 0.05);

      totalIncome += Math.round(
        (market.budget / 12) * penetrationRate * myShare,
      );

      const growth = Math.random() * 0.1 - 0.03;
      return {
        ...market,
        budget: Math.round(market.budget * (1 + growth)),
      };
    });

    const newBalance = company.balance + totalIncome - company.monthCosts;

    const updatedCompany = {
      ...company,
      monthProfit: totalIncome,
      balance: newBalance,
      monthHistory: [
        ...(company.monthHistory || []),
        { balance: newBalance, costs: company.monthCosts, profit: totalIncome },
      ],
    };

    setUserData({ ...userData, company: updatedCompany });

    setData({ ...data, markets: updatedMarkets });
  }

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current;
    if (!ctx) return;

    const history = userData?.company?.monthHistory || [];
    const labels = history.map((_, i) => `Міс. ${i + 1}`);
    const realBalance = history.map((m) => m.balance);
    const modelBalance = history.map((m) => m.balance + m.costs);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = labels;
      chartInstanceRef.current.data.datasets[0].data = realBalance;
      chartInstanceRef.current.data.datasets[1].data = modelBalance;
      chartInstanceRef.current.update();
      return;
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Реальний баланс",
            data: realBalance,
            borderColor: "#1A794B",
            backgroundColor: "rgba(50, 199, 72, 0.1)",
            fill: true,
            tension: 0.3,
          },
          {
            label: "Без витрат (модель)",
            data: modelBalance,
            borderColor: "#aaa",
            borderDash: [5, 5],
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { ticks: { callback: (val) => `$${val.toLocaleString()}` } },
        },
      },
    });

    return () => {
      // cleanup при unmount
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [userData?.company?.monthHistory]);

  if (!isLoggedIn) {
    return <LoginOrRegister />;
  }

  if (Object.keys(userData.company).length == 0) {
    return (
      <div className="flex-column">
        <h3>Ще немає компанії!</h3>
        <Link className="button green" to="/create-startup">
          Створити власну компанію!
        </Link>
      </div>
    );
  }

  return (
    <main className="wrapper">
      <section id="my-startup" className="my-startup-section">
        <button
          className="button green"
          id="nextMonthSimulationButton"
          onClick={nextMonth}
        >
          Наступний місяць
        </button>

        <div className="my-startup-info">
          <div className="my-startup-info-element">
            <h3 className="my-startup-info-title">Моя компанія</h3>

            <div className="my-startup-info-block">
              <div className="my-startup-header">
                <img
                  className="my-startup-logo"
                  src="../src/images/my-company-icon.png"
                />
                <h3 className="my-startup-title" id="companyTitle">
                  {userData.company.title}
                </h3>
              </div>

              <div className="my-startup-block">
                <div className="my-startup-block-item">
                  <h4>Моя частка</h4>
                  <p id="companyPercentage">
                    {userData.company.myCompanyPart}%
                  </p>
                </div>
              </div>

              <div className="my-startup-item">
                <img src={regionIcon} />
                <div>
                  <h4>Ринки</h4>
                  {asList(userData.company.region)}
                </div>
              </div>

              <div className="my-startup-item">
                <img src={fieldIcon} />
                <div>
                  <h4>Сфера</h4>
                  {asList(userData.company.area)}
                </div>
              </div>
            </div>
          </div>

          <div className="my-startup-info-element">
            <h3 className="my-startup-info-title">Статистика</h3>

            <div className="my-startup-info-block">
              <div className="my-startup-block">
                <div className="my-startup-block-item">
                  <h4>Сила</h4>
                  <p id="companyStrength">
                    {userData.company.empoyees + userData.company.offices}
                  </p>
                </div>
                <div className="my-startup-block-item">
                  <h4>Баланс</h4>
                  <p id="companyBalance">${userData.company.balance}</p>
                </div>
                <div className="my-startup-block-item">
                  <h4>Прибуток / міс.</h4>
                  <p className="green" id="companyMonthProfit">
                    ${userData.company.monthProfit}
                  </p>
                </div>
                <div className="my-startup-block-item">
                  <h4>Витрати / міс.</h4>
                  <p className="green" id="companyMonthPayment">
                    ${userData.company.monthCosts}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-startup-info-element">
              <canvas ref={chartRef}></canvas>
              <h3 className="my-startup-info-title">Баланс по місяцях</h3>
            </div>
          </div>
        </div>

        <div className="my-startup-managment">
          <div className="my-startup-info-element">
            <h3 className="my-startup-info-title">Працівники</h3>

            <div className="my-startup-info-block">
              <div className="my-startup-block-item">
                <h4>Кількість</h4>
                <p id="companyEmployeesCount">
                  {userData.company.empoyees}/
                  {userData.company.offices *
                    userData.company.maxEmpoyeesPerOffice}
                </p>
              </div>

              <div className="my-startup-block-item">
                <h4>Вільних місць</h4>
                <p id="companyAvailablePlacesForEmployees">
                  {userData.company.offices *
                    userData.company.maxEmpoyeesPerOffice -
                    userData.company.empoyees}
                </p>
              </div>
              <button
                type="button"
                className="button red"
                onClick={removeEmployee}
              >
                звільнити
              </button>
              <button
                type="button"
                className="button green"
                onClick={addEmployee}
              >
                найняти
              </button>
            </div>
          </div>

          <div className="my-startup-info-element">
            <h3 className="my-startup-info-title">Офіси</h3>

            <div className="my-startup-info-block">
              <div className="my-startup-block-item">
                <h4>Кількість</h4>
                <p id="companyOfficesCount">{userData.company.offices}</p>
              </div>
              <button
                type="button"
                className="button red"
                onClick={removeOffice}
              >
                зняти оренду
              </button>
              <button
                type="button"
                className="button green"
                onClick={addOffice}
              >
                орендувати
              </button>
            </div>
          </div>
        </div>

        <div className="my-startup-info-element">
          <h3 className="my-startup-info-title">Мої ринки збуту</h3>
          <table>
            <thead>
              <tr>
                <th>Ринок</th>
                <th>Сфера</th>
                <th>Частка ринку</th>
                <th>Розмір</th>
                <th>Оплата/міс.</th>
                <th>Дохід</th>
                <th>Прибуток</th>
              </tr>
            </thead>
            <tbody id="companyMarketsTable">
              {myMarkets.map((market) => (
                <MyMarketRow
                  key={market.id}
                  market={market}
                  share={getMyMarketShare(market.id)}
                  leaveMarket={() => leaveMarket(market)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="my-startup-info-element">
          <h3 className="my-startup-info-title">Мої інвестори</h3>
          <table>
            <thead>
              <tr>
                <th>Інвестор</th>
                <th>Ринок</th>
                <th>Сфера</th>
                <th>Частка компанії (%)</th>
                <th>Розмір (сума інвестиції)</th>
                <th>Прибуток</th>
              </tr>
            </thead>
            <tbody id="companyInvestors">
              {myInvestors.map((investor) => (
                <MyInvestorRow
                  key={investor.id}
                  investor={investor}
                  share={share(investor)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
