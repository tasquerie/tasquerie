import { User } from "./User";
import { IDManager } from "./IDManager";
import { FirebaseUserAPI } from "../firebaseAPI";
import { UserID } from "../types/UserID";
import { Result } from "../types/FirebaseResult";
export class UserManager {
  // public getUserFromLogin(username: string, password: string): User | undefined {
  //   if (this.USE_DB) {
  //     throw new Error("not Implemented");
  //   } else {
  //     if (this.nameToPass.get(username) === password) {
  //       return this.nameToUser.get(username);
  //     } else {
  //       return undefined;
  //     }
  //   }
  // }

  // ALL FIELDS FOR TESTING ONLY!!
  public USE_DB: boolean = false;
  private nameToUser: Map<string, User>;
  private nameToPass: Map<string, string>;

  // CONSTRUCTOR FOR TESTING ONLY!!
  constructor(idMan: IDManager) {
    this.nameToUser = new Map<string, User>;
    this.nameToPass = new Map<string, string>;
  }

  // FOR UNIT TESTING ONLY!! (should comment out when done)
  public addUser(username: string, password: string, user: User) {
    this.nameToPass.set(username, password);
    this.nameToUser.set(username, user);
  }


  public async usernameExists(username: string): Promise<boolean> {
    if (this.USE_DB) {
      const UID = {id: username};
      const result = await FirebaseUserAPI.getUser(UID);

      if (result.status === false && result.content === undefined) {
        return false;
      } else if (result.status === true) {
        return true;
      } else { // NOTE: Case if server fails so maybe undefined?
        return false;
      }

    } else {
      return this.nameToUser.has(username);
    }
  }

  // NOTE: Keep in the back mind in case but we don't use password directly,
  // instead use uid we get after use successfully signs in

  // TODO: integrate with database
  public getUserFromLogin(username: string, password: string): User | undefined {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      if (this.nameToPass.get(username) === password) {
        return this.nameToUser.get(username);
      } else {
        return undefined;
      }
    }
  }

  public async getUser(uid: UserID): Promise<Result> {
    const result = FirebaseUserAPI.getUser(uid);
    return result;
  }
}