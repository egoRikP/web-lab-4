import { asList } from "../utils/renderUtils";

import fieldIcon from "../assets/images/field-icon.png";
import regionIcon from "../assets/images/region-icon.png";

export function CompetitorCard({ competitor, share }) {
  return (
    <li className="card-item myItem">
      <div className="competitor-header">
        <div className="logo-box">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              competitor.company.title,
            )}&background=random&size=80`}
            alt={`company ${competitor.company.title} avatar`}
          />
        </div>
        <h3 className="competitor-name">{competitor.company.title}</h3>
      </div>

      <div className="card-row grid-2">
        <div className="stat-block">
          <h4 className="label">Частка ринку</h4>
          <p className="green">{share}%</p>
        </div>
        <div className="stat-block">
          <h4 className="label">прибуток</h4>
          <p className="green">
            ${competitor.company.monthProfit - competitor.company.monthCosts}
          </p>
        </div>
        <div className="stat-block">
          <h4 className="label">працівників</h4>
          <p className="value">{competitor.company.empoyees}</p>
        </div>
        <div className="stat-block">
          <h4 className="label">дохід</h4>
          <p className="green">$3M</p>
        </div>
      </div>

      <div className="card-row grid-2">
        <div className="icon-text">
          <img src={regionIcon} alt="Region" />
          <div>
            <span className="label">Ринки</span>
            {asList(competitor.company.region ?? [])}
          </div>
        </div>
        <div className="icon-text">
          <img src={fieldIcon} alt="Field" />
          <div>
            <span className="label">Сфера</span>
            {asList(competitor.company.area ?? [])}
          </div>
        </div>
      </div>
    </li>
  );
}
