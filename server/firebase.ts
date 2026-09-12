import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "../shared/firebaseConfig";

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp };
