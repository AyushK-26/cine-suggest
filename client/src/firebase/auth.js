import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (
  username,
  email,
  password
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", res.user.uid), {
    uid: res.user.uid,
    username,
    email,
    favorites: [],
  }).catch((error) => console.error(error));
  return res;
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
  return auth.signOut();
};
