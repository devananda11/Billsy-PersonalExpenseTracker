
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore,doc,setDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu3UNbPSFq07vjQ6oM2iSb8JmmkMt1ec0",
  authDomain: "billsy-1d62d.firebaseapp.com",
  projectId: "billsy-1d62d",
  storageBucket: "billsy-1d62d.appspot.com",
  messagingSenderId: "423300050209",
  appId: "1:423300050209:web:109b63048ffdcc28f6a260",
  measurementId: "G-CHQK7BX4Z6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};