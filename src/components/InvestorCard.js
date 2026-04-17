import investorIcon from "../assets/images/investor-icon.png";

import { asList } from "../utils/renderUtils";

export function InvestorCard({
  investor,
  userData,
  hasCompany,
  isMatchingArea,
  onAddInvestor,
}) {
  return (
    <li
      className={`investor-item ${isMatchingArea(investor) ? "myCategory" : ""}`}
    >
      <div className="investor-header">
        <img className="investor-icon" src={investorIcon} alt="Investor icon" />
        <p className="investor-name">{investor.title}</p>
      </div>
      <div className="investor-body">
        <div className="investor-check">
          <div className="investor-block-item">
            <h4>Чек</h4>
            <p>${investor.check}</p>
          </div>

          <div className="investor-block-item">
            <h4>Бюджет</h4>
            <p>${investor.budget}</p>
          </div>

          <div className="investor-block-item">
            <h4>Середній %</h4>
            <p>{investor.averageCheckPercent}%</p>
          </div>
        </div>

        <div className="investor-info">
          <div className="investor-block-item">
            <h4>Регіон</h4>
            {asList(investor.region)}
          </div>

          <div className="investor-block-item">
            <h4>Сфера</h4>
            {asList(investor.area)}
          </div>
        </div>
      </div>

      {!userData?.company.investors?.includes(investor.id) ? (
        <button
          className="button green investor-button"
          onClick={() => onAddInvestor(investor)}
          disabled={!hasCompany}
        >
          Запросити
        </button>
      ) : (
        <button className="button investor-button">Ви запросили</button>
      )}
    </li>
  );
}
