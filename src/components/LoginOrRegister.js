import { Link } from "react-router-dom";

export function LoginOrRegister() {
  return (
    <div className="flex-column">
      <h3>Ще немає акаунта!</h3>
      <Link className="button green" to="/login">
        Увійти
      </Link>
      <h3>Або</h3>
      <Link className="button green" to="/register">
        Зареєструватись
      </Link>
    </div>
  );
}
