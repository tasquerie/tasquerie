import { Egg } from "./Egg";
import { Task } from "./Task";
import { TaskFolder } from "./TaskFolder";
import { IDManager } from "./IDManager";

import { UserID } from "../types/UserID";
import { TaskID } from "../types/TaskID";
import { DateTime } from "../types/DateTime";
import { Duration } from "../types/Duration";

export class User {
  private uniqueID: UserID;
  private username: string; // NOTE: User type should not remember username
  private password: string; // NOTE: User type should not rememebr password
  private taskFolders: Map<string, TaskFolder>;
  private univCredits: number;
  private streak: number;

  constructor(userID: UserID, username: string, password: string) {
    this.uniqueID = userID;
    this.username = username;
    this.password = password;

    this.taskFolders = new Map<string, TaskFolder>();
    this.univCredits = 0;
    this.streak = 0;
  }

  getID(): UserID {
    return this.uniqueID;
  }

  setID(id: UserID) {
    this.uniqueID = id; 
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

  getTaskFolders(): Map<string, TaskFolder> {
    return this.taskFolders;
  }

  // TODO: implement this
  getJSON(): string {
    const jsonUser = {
      // Take ID out when testing
      uniqueID: this.uniqueID,
      username:this.username,
      taskFolders: this.taskFolders,
      univCredits:this.univCredits,
      streak:this.streak
    };
    return JSON.stringify(jsonUser);
  }
}