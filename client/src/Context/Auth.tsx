import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAdditionalUserInfo } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { BackendWrapper } from '../BackendWrapper';
import Axios from 'axios';

class Auth{
    // loading field for style
    user: any; // holds user OBJECT. not UID
    provider: any;

    constructor() {
        this.user = '';
        this.provider = new GoogleAuthProvider();
        this.provider.setCustomParameters({ prompt: 'select_account' });
    }

    // getUser() {
    //     return this.user;
    // }

    // async signIn(email: string, password: string) {
    //     console.log('signin called');
    //     let args: Map<string, any> = new Map();
    //     args.set("username", email);
    //     args.set("password", password);

    //     try {
    //         this.user = await BackendWrapper.login("login", args);
    //         console.log(JSON.stringify(this.user));
    //         if (this.user === null) {
    //             throw Error;
    //         }
    //         console.log('login successful');
    //     } catch (e) {
    //         console.log("Failure to sign in");
    //         this.user = '';
    //     }
    // }

    // async signUp(email: string, password: string) {
    //     console.log('signup called');
    //     let args: Map<string, any> = new Map();
    //     args.set("username", email);
    //     args.set("password", password);

    //     try {
    //         this.user = await BackendWrapper.login("signup", args);
    //         console.log(JSON.stringify(this.user));
    //         if (this.user === null) {
    //             throw Error;
    //         }
    //         console.log('signup successful');
    //     } catch (e) {
    //         console.log("Failure to sign in");
    //         this.user = '';
    //     }
    // }

    // async signOut() {
    //     try {
    //         await BackendWrapper.login("logout", new Map());
    //     } catch (e) {
    //         console.log("Failure to log out");
    //     }
    //     this.user = '';
    // }

    // ========== BELOW ARE FIREBASE-BASED LOGIN SYSTEMS ==========
    // preserved because if one day backend and database talk to each
    // other properly, these can be used

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

            let folderMap = {
                "testFolder": {
                    name: "testFolder",
                    description: "testFolder description",
                    egg: {
                        eggType: "blue",
                        eggStage: 0,
                        exp: 0
                    },
                    eggCredits: 0,
                    taskIDtoTasks: {}
                }
            }

            let userData = {
                uniqueID: ret,
                username: email,
                taskFolders: folderMap,
                univCredits: 0
            }

            const data = {
                userID: ret,
                userData: userData
            }

            const response = await Axios.post("https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/add", data);
            console.log(response.data);
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
}

export default Auth;