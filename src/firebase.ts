import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import {
  collection,
  CollectionReference,
  DocumentData,
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore";

const IS_LOCAL = import.meta.env.DEV;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: IS_LOCAL ? "demo-app" : import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_AAP_ID,
};

interface AppSetup {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const initialize = (): AppSetup => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
};

const initializeWithEmulators = ({ app, auth, firestore }: AppSetup): AppSetup => {
  if (IS_LOCAL) {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

    connectFirestoreEmulator(firestore, "localhost", 8080);
  }
  return { app, auth, firestore };
};

const getFirebase = () => {
  const existingApp = getApps().at(0);
  if (existingApp) return initialize();
  return initializeWithEmulators(initialize());
};

const { auth, firestore } = getFirebase();

export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export { auth, firestore };
