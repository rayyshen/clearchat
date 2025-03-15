// initFirebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
} else {
  // If an app is already initialized, use that one.
  firebaseApp = getApps()[0];
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
}

export { firebaseApp, auth, db };