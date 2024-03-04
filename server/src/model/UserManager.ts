import { User } from "./User";
import { IDManager } from "./IDManager";

export class UserManager {
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
    // console.log("DEBUG: adding user " + username);
    this.nameToPass.set(username, password);
    this.nameToUser.set(username, user);
  }


  // TODO: integrate with database
  public usernameExists(username: string): boolean {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      // console.log("DEBUG: checking user " + username);
      // console.log("DEBUG: user exists? " + this.nameToUser.has(username));
      return this.nameToUser.has(username);
    }
  }

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
}