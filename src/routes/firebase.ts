import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAEss4tkvISJINKqR-BtnBaxa3_rgUrPLM",
  authDomain: "dronitter-88893.firebaseapp.com",
  projectId: "dronitter-88893",
  storageBucket: "dronitter-88893.appspot.com",
  messagingSenderId: "194467029221",
  appId: "1:194467029221:web:7817bee9f38050dfdff40c",
  measurementId: "G-XZQPHQZYL1"
};

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const auth = getAuth(app)
