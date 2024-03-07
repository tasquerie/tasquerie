import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAdditionalUserInfo, getAuth, Unsubscribe   } from 'firebase/auth';
import { auth } from '../firebase/firebase'
const axios = require('axios');

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const withAuth = (Component) => {
  return function AuthComponent(props) {
    const auth = useAuth();
    return <Component {...props} auth={auth} />;
  };
};

export const AuthContextProvider = ({ children }) => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

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
      console.log(email);
      console.log(password);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
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
   * Since google is taking care of everything, use this if you want to
   * use google sign in / sign up process.
   */
  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const test = getAdditionalUserInfo(result);

      if (test.isNewUser) {
        try {

          const reqBody = 3;
          const response = await axios.post("http://localhost:3000/api/firebase/user/add", reqBody);
        } catch (err) {
          console.error("googleSignIn:", err);
        }
      }
      console.log(user);
      console.log(test);
    } catch (err) {

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
    googleSignIn,
    signIn,
    signUp,
    signOut
  }


  // NOTE:
  // Example usage of AuthContext.js on login page
  // const { getUser, googleSignIn, signIn, signUp, signOut } = useAuth();
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
