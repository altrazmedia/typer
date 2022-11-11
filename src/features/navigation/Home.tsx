import { useAuthContext } from "src/features/auth";

export const Home: React.FC = () => {
  const { user, profile, signOut } = useAuthContext();

  return (
    <>
      {!!user && <h2>Hello, {profile?.name}!</h2>}
      <button onClick={signOut} className="btn-primary btn">
        Wyloguj
      </button>
    </>
  );
};
