import { asList } from "../utils/renderUtils";

export function MyInvestorRow({ investor, share }) {
  return (
    <tr>
      <td>{investor.title}</td>
      <td>{asList(investor.region)}</td>
      <td>{asList(investor.area)}</td>
      <td>{investor.averageCheckPercent}%</td>
      <td>${investor.check}</td>
      <td>${share.toFixed(2)}</td>
    </tr>
  );
}
