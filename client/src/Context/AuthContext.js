import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase/firebase'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }) => {

  // const provider = new GoogleAuthProvider();
  // provider.setCustomParameters({ prompt: 'select_account' });

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Signs in user with the given email and password.
   * Throws an error if given user doesn't exist, invalid email, or incorrect password
   * @param {string} email
   * @param {string} password
   * @returns firebase users object
   */
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return user;
    } catch (err) {
      // If incorrect password is given for an existing email
      if (err.code === "auth/invalid-credential") {
        // TODO: Logic for invalid credential
        return null;
      }
      console.error(err);
    }
  }

  /**
   * Creates a new user in firebase auth with the given email and password.
   * Throws an error if user already exists, email is invalid, or if
   * password less than 6 characters
   * @param {string} email
   * @param {string} password
   */
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return user;
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        // TODO: Logic for email in use
        return null;
      } else if (err.code === "auth/weak-password") {
        // TODO: Logic for weak password
        return null
      }
    }
  }

  /**
   * Returns the currently signed in user
   * @returns firebase user object
   */
  const getUser = () => {
    return auth.currentUser;
  }

  /**
   * Signs out the current user
   * @returns Firebase signout function
   */
  const signOut = async () => {
    window.location.href = "/";
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe
  }, [])

  const value = {
    getUser,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
