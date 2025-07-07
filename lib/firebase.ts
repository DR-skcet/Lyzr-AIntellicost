// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVHJd0YNjuH2TkoMx_5tZNUixVZioXhFI",
  authDomain: "lyzraintellicost.firebaseapp.com",
  projectId: "lyzraintellicost",
  storageBucket: "lyzraintellicost.appspot.com",
  messagingSenderId: "921961947412",
  appId: "1:921961947412:web:de9bde74e0c3c318712201",
  measurementId: "G-HYHNL1D0JT"
}

// Initialize Firebase (prevent re-initialization on hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export { app, analytics };
