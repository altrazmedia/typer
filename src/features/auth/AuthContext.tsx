import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { createContext, PropsWithChildren, useEffect, useState } from "react";
import { auth } from "src/firebase";

interface ContextValue {
  user: User | null;
  signInWithGoogle(): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  registerWithEmailAndPassword(email: string, password: string): Promise<any>;
  signOut(): void;
}

export const AuthContext = createContext<ContextValue>(null!);
const googleProvider = new GoogleAuthProvider();

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    auth.signOut();
  };

  const registerWithEmailAndPassword = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signInWithGoogle,
        signOut,
        registerWithEmailAndPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
