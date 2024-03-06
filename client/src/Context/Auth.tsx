import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAdditionalUserInfo } from 'firebase/auth';
import { auth } from '../firebase/firebase';

class Auth{
    // loading field for style
    user: any; // holds user OBJECT. not UID
    provider: any;

    constructor() {
        this.user = null;
        this.provider = new GoogleAuthProvider();
        this.provider.setCustomParameters({ prompt: 'select_account' });
    }

    async signIn(email: string, password: string): Promise<string> {
        let ret: string = '';

        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          this.user = userCredential.user;
          ret = this.user.uid;
          console.log(`user ${ret} logged in`);
        } catch (err) {
          // If incorrect password is given for an existing email
          if ((err as NodeJS.ErrnoException).code === "auth/invalid-credential") {
            // TODO: Logic for invalid credential
          }
          console.error(err);
        }

        return ret;
    }

    async googleSignIn(): Promise<string> {
        let ret: string = '';
        try {
          const result = await signInWithPopup(auth, this.provider);
          this.user = result.user;
          const user = this.user.uid;
          const test = getAdditionalUserInfo(result);
          console.log(user);
          console.log(test);
          ret = user;
        } catch (err) {
            // error handling
        }
        return ret;
    }

    async signUp(email: string, password: string): Promise<string> {
        let ret: string = '';
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            this.user = userCredential.user;
            ret = this.user.uid;
        } catch (err) {
            console.error(err);

            if ((err as NodeJS.ErrnoException).code === "auth/email-already-in-use" ||
            (err as NodeJS.ErrnoException).code === "auth/weak-password") {
                // TODO: Logic for email in use
            }
        }
        return ret;
    }

    getUser(): string {
        if (auth.currentUser === null) {
            return '';
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