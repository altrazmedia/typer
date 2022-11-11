import { FormEventHandler, useContext, useState } from "react";
import { Link } from "react-router-dom";

import { FormInput } from "src/features/ui";

import { AuthFormLayout } from "./AuthFormLayout";
import { AuthContext } from "./AuthContext";

export const SignIn: React.FC = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithGoogle, signIn, signOut } = useContext(AuthContext);

  const handleSignInWithGoogleClick = async () => {
    setError(false);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(true);
    }
  };

  const handleSignInClick: FormEventHandler = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <AuthFormLayout title="Zaloguj się">
      <form onSubmit={handleSignInClick}>
        <FormInput type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <FormInput type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
        {error && (
          <div className="alert alert-error mb-3 mt-3">
            <span>Nie udało się zalogować</span>
          </div>
        )}
        <button className="btn-primary btn mt-3 w-full">Zaloguj</button>
      </form>

      <div className="divider"></div>
      <button className="btn-secondary btn" onClick={handleSignInWithGoogleClick}>
        Zaloguj z Google
      </button>
      <Link to="/register">
        <button className="btn-ghost btn w-full">Załóż konto</button>
      </Link>
      <button className="btn-ghost btn" onClick={signOut}>
        Wyloguj
      </button>
    </AuthFormLayout>
  );
};
