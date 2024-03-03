import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase/firebase';

class Auth{
    // loading field for style
    user: any;

    constructor() {
        this.user = null;
    }

    async signIn(email: string, password: string): Promise<string|null> {
        let ret: string | null = null;

        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          ret = userCredential.user.uid;
          console.log(`user ${ret} logged in`);
        } catch (err) {
          // If incorrect password is given for an existing email
          if ((err as NodeJS.ErrnoException).code === "auth/invalid-credential") {
            // TODO: Logic for invalid credential
            ret = null;
          }
          console.error(err);
        }

        return ret;
    }

    async signUp(email: string, password: string): Promise<string|null> {
        let ret: string|null = null;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            ret = userCredential.user.uid;
        } catch (err) {
            console.error(err);

            if ((err as NodeJS.ErrnoException).code === "auth/email-already-in-use" ||
            (err as NodeJS.ErrnoException).code === "auth/weak-password") {
            // TODO: Logic for email in use
            ret = null;
            }
        }
        return ret;
    }

    getUser(): string|null {
        if (auth.currentUser === null) {
            return null;
        } else {
            return auth.currentUser.uid;
        }
    }
    
    async signOut() {
        window.location.href = "/";
        return auth.signOut();
    }

    // ?????????
    update() {
        // the following is a callback func
        const unsubscribe = auth.onAuthStateChanged(user => {
            this.user = user;
          });
      
          return unsubscribe
    }
}

export default Auth;