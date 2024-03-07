
import { UserID } from "../types/UserID";


export class User {
  private uniqueID: UserID;
  private univCredits: number;
  private streak: number;

  constructor(userID: UserID) {
    this.uniqueID = userID;
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


  // TODO: implement this
  getJSON(): string {
    const jsonUser = {
      // Take ID out when testing
      uniqueID: this.uniqueID.id,
      // username:this.username,
      // taskFolderKeys: Array.from(this.taskFolders.keys()),
      univCredits:this.univCredits,
      streak:this.streak
    };
    return JSON.stringify(jsonUser);
  }

  toFirestoreObject(): object {
    return {
      uniqueID: this.uniqueID.id,
      // username: this.username,
      // password: this.password,
      // taskFolders: Object.fromEntries(
      //   Array.from(this.taskFolders.entries()).map(([folderName, folder]) => [
      //     folderName,
      //     folder.toFirestoreObject(),
      //   ])
      // ),
      univCredits: this.univCredits,
      streak: this.streak,
    };
  }
}