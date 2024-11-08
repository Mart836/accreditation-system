// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getFirestore} from 'firebase/firestore';
//import { getDatabase } from "firebase/database";


//import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXULZo6buD08m76NoUh-vfp1y4IJEHjBg",
  authDomain: "accreditation-system-651ba.firebaseapp.com",
 // databaseURL: "Acreditation-systemhttps://console.firebase.google.com/project/accreditation-system-651ba/database/accreditation-system-651ba-default-rtdb/data/~2F",
  projectId: "accreditation-system-651ba",
  storageBucket: "accreditation-system-651ba.appspot.com",
  messagingSenderId: "843291971202",
  appId: "1:843291971202:web:01d8ccabb490b94cc46e9b",
  measurementId: "G-4C7841119X"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const database = getDatabase(app);
//const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Firebase Messaging
let messaging;
try {
    messaging = getMessaging(app);
} catch (error) {
    console.warn("Firebase Messaging is not supported in this environment.", error);
}


export { app, auth,db,messaging };
