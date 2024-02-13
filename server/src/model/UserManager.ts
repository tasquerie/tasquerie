import { User } from "./User";
import { IDManager } from "./IDManager";

export class UserManager {
  // ALL FIELDS FOR TESTING ONLY!!
  private USE_DB: boolean = false;
  private nameToUser: Map<string, User>;
  private nameToPass: Map<string, string>;

  // CONSTRUCTOR FOR TESTING ONLY!!
  constructor(idMan: IDManager) {
    this.nameToUser = new Map<string, User>;
    this.nameToPass = new Map<string, string>;
  }

  // FOR UNIT TESTING ONLY!! (should uncomment when done)
  public addUser(username: string, password: string, user: User) {
    this.nameToPass.set(username, password);
    this.nameToUser.set(username, user);
  }


  // TODO: integrate with database
  public usernameExists(username: string): boolean {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
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