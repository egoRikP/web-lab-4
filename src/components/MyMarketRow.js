import { asList } from "../utils/renderUtils";

export function MyMarketRow({ market, share, leaveMarket }) {
  return (
    <tr>
      <td>{asList(market.region)}</td>
      <td>{asList(market.area)}</td>
      <td>{share}%</td>
      <td>${market.budget}</td>
      <td>${market.monthPayment}</td>
      <td>${market.startSum}</td>
      <td>${market.startSum}</td>
      <td>
        <button
          type="button"
          className="button red leave-market-button"
          onClick={leaveMarket}
        >
          вийти з ринку
        </button>
      </td>
    </tr>
  );
}
