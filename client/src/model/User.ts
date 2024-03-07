import { UserID } from "../types/UserID";

export class User {
  private uniqueID: UserID;
  private univCredits: number;
  private streak: number;
  private username: string;
  constructor(userID: UserID, username: string) {
    this.uniqueID = userID;
    this.username = username;
    this.univCredits = 0;
    this.streak = 0;
  }

  getID(): UserID {
    return this.uniqueID;
  }

  getUnivCredits(): number {
    return this.univCredits;
  }

  setUnivCredits(credits: number): void {
    this.univCredits = credits;
  }

  getStreak(): number {
    return this.streak;
  }

  setStreak(streak: number): void {
    this.streak = streak;
  }

  getJSON(): any {
    const jsonUser = {
      // Take ID out when testing
      uniqueID: this.uniqueID.id,
      // username:this.username,
      // taskFolderKeys: Array.from(this.taskFolders.keys()),
      univCredits:this.univCredits,
      streak:this.streak,
      username:this.username,
    };
    return jsonUser;
  }
}