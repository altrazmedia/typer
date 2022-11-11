import { Link } from "react-router-dom";
import { AuthFormLayout } from "./AuthFormLayout";

export const Register: React.FC = () => {
  return (
    <AuthFormLayout title="Załóż konto">
      <input type="text" placeholder="Email" className="input-bordered input mb-2 w-full max-w-xs" />
      <input type="password" placeholder="Hasło" className="input-bordered input mb-2 w-full max-w-xs" />
      <input type="password" placeholder="Powtórz hasło" className="input-bordered input mb-2 w-full max-w-xs" />
      <button className="btn-primary btn">Załóż konto</button>
      <button className="btn-secondary btn">Zarejestruj z Google</button>
      <div className="divider">LUB</div>
      <div className="flex justify-center">
        <Link to="/login">
          <button className="btn-ghost btn-sm btn">Zaloguj się</button>
        </Link>
      </div>
    </AuthFormLayout>
  );
};
