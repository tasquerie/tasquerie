import { User } from "./User";

export class UserManager {
  // TODO: integrate with database
  public usernameExists(username: string): boolean {
    return true;
  }

  // TODO: integrate with database
  public getUserFromLogin(username: string, password: string): User | undefined {
    return undefined;
  }
}