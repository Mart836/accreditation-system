// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXULZo6buD08m76NoUh-vfp1y4IJEHjBg",
  authDomain: "accreditation-system-651ba.firebaseapp.com",
  projectId: "accreditation-system-651ba",
  storageBucket: "accreditation-system-651ba.appspot.com",
  messagingSenderId: "843291971202",
  appId: "1:843291971202:web:01d8ccabb490b94cc46e9b",
  measurementId: "G-4C7841119X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth };
