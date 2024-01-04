import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2o3SuqJEKgla8FeUIykbaMcDRTJd2aW4",
  authDomain: "drawingtool-e25a4.firebaseapp.com",
  projectId: "drawingtool-e25a4",
  storageBucket: "drawingtool-e25a4.appspot.com",
  messagingSenderId: "243868532402",
  appId: "1:243868532402:web:5d9557fb85866eaf94d3ab",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
