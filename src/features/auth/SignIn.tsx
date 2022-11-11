import { Link } from "react-router-dom";
import { AuthFormLayout } from "./AuthFormLayout";

interface Props {}

export const SignIn: React.FC<Props> = () => {
  return (
    <AuthFormLayout title="Zaloguj się">
      <input type="text" placeholder="Email" className="input-bordered input mb-2 w-full max-w-xs" />
      <input type="password" placeholder="Hasło" className="input-bordered input mb-2 w-full max-w-xs" />
      <button className="btn-primary btn">Zaloguj</button>
      <button className="btn-secondary btn">Zaloguj z Google</button>
      <div className="divider">LUB</div>
      <div className="flex justify-center">
        <Link to="/register">
          <button className="btn-ghost btn">Załóż konto</button>
        </Link>
      </div>
    </AuthFormLayout>
  );
};
