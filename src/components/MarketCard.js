import fieldIcon from "../assets/images/field-icon.png";
import regionIcon from "../assets/images/region-icon.png";

import { asList } from "../utils/renderUtils";

export function MarketCard({
  market,
  canTakeMarket,
  isMyMarket,
  isMyCategory,
  takeMarket,
}) {
  return (
    <li className={`card-item ${isMyCategory ? "myCategory" : ""}`}>
      <div className="card-row grid-2">
        <div className="icon-text">
          <img src={regionIcon} alt="Region" />
          <div>
            <span className="label">Ринок</span>
            {asList(market.region)}
          </div>
        </div>
        <div className="icon-text">
          <img src={fieldIcon} alt="Field" />
          <div>
            <span className="label">Сфера</span>
            {asList(market.area)}
          </div>
        </div>
      </div>
      <div className="card-row grid-2">
        <div className="stat-block">
          <h4 className="label">Місткість</h4>
          <p className="green">${market.budget}</p>
        </div>
        <div className="stat-block">
          <h4 className="label">Вхідний поріг</h4>
          <p className="green">${market.startSum}</p>
        </div>
        <div className="stat-block">
          <h4 className="label">Оплата/міс.</h4>
          <p className="green">${market.monthPayment}</p>
        </div>
        <div className="stat-block">
          <h4 className="label">Конкуренція</h4>
          <p className="green">висока</p>
        </div>
      </div>
      {isMyMarket ? (
        <button
          type="button"
          className="button no-active full-width market-button"
          disabled
        >
          вже на ринку
        </button>
      ) : (
        <button
          type="button"
          className="button green-btn full-width market-button"
          disabled={canTakeMarket}
          onClick={takeMarket}
        >
          увійти
        </button>
      )}
    </li>
  );
}
