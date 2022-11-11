import { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";

import { FormInput } from "src/features/ui";

import { useAuthContext } from "./AuthContext";
import { AuthFormLayout } from "./AuthFormLayout";

interface Errors {
  email: string;
  password: string;
  passwordConfirm: string;
}

const emptyErrors: Errors = {
  email: "",
  password: "",
  passwordConfirm: "",
};

export const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({ ...emptyErrors });
  const [generalError, setGeneralError] = useState(false);

  const { registerWithEmailAndPassword } = useAuthContext();

  const validate = () => {
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const errors = { ...emptyErrors };

    if (!email.match(emailRegex)) {
      errors.email = "Podaj poprawny email";
    }

    if (password.length < 6) {
      errors.password = "Hasło musi zawierać min. 6 znaków";
    } else if (password !== passwordConfirm) {
      errors.passwordConfirm = "Hasła nie są identyczne";
    }

    setErrors(errors);
    return !Object.values(errors).find((er) => !!er.length);
  };

  const submitForm: FormEventHandler = async (e) => {
    e.preventDefault();
    setGeneralError(false);

    if (!validate()) return;

    try {
      await registerWithEmailAndPassword(email, password);
    } catch (err) {
      setGeneralError(true);
    }
  };

  return (
    <AuthFormLayout title="Załóż konto">
      <form onSubmit={submitForm}>
        <FormInput type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <FormInput
          type="password"
          placeholder="Hasło"
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <FormInput
          type="password"
          placeholder="Powtórz hasło"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          error={errors.passwordConfirm}
        />
        {generalError && (
          <div className="alert alert-error mb-3 mt-3">
            <span>Coś pozło nie tak</span>
          </div>
        )}
        <button className="btn-primary btn mt-3 w-full">Załóż konto</button>
      </form>
      <div className="divider"></div>
      <Link to="/login">
        <button className="btn-ghost btn w-full">Zaloguj się</button>
      </Link>
    </AuthFormLayout>
  );
};
