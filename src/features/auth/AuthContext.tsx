import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, query, where, getDocs, setDoc } from "firebase/firestore";
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";

import { auth, createCollection } from "src/firebase";

import type { Profile } from "./types";

interface ContextValue {
  user: User | null;
  profile: Profile | null;
  signInWithGoogle(): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  registerWithEmailAndPassword(email: string, password: string): Promise<any>;
  signOut(): void;
}

const AuthContext = createContext<ContextValue>(null!);

const googleProvider = new GoogleAuthProvider();
const profilesCollection = createCollection<Profile>("profiles");

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const getUserProfile = useCallback(async (uid: string) => {
    const q = query(profilesCollection, where("uid", "==", uid));
    const profiles = await getDocs(q);

    if (profiles.size) {
      return profiles.docs[0];
    }
    return null;
  }, []);

  const getOrCreateProfile = useCallback(
    async (uid: string, name: string) => {
      const profile = await getUserProfile(uid);
      if (profile?.data()) {
        setProfile(profile.data());
      } else {
        const newProfile: Profile = { uid, name };
        const docRef = doc(profilesCollection);
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    },
    [getUserProfile]
  );

  const signInWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await getOrCreateProfile(user.uid, user.email!);
  };

  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await getOrCreateProfile(user.uid, email);
  };

  const signOut = () => {
    auth.signOut();
    setProfile(null);
  };

  const registerWithEmailAndPassword = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        const profileData = profile?.data();
        if (profileData) {
          setProfile(profileData);
        }
      }
    });

    return unsubscribe;
  }, [getUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
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

export const useAuthContext = () => useContext(AuthContext);
