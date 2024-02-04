import { Egg } from "./Egg";
import { Task } from "./Task";
import { TaskFolder } from "./TaskFolder";
import { IDManager } from "./IDManager";

import { UserID } from "../types/UserID";
import { TaskID } from "../types/TaskID";
import { DateTime } from "../types/DateTime";
import { Duration } from "../types/Duration";

export class User {
  private readonly uniqueID: UserID;
  private username: string;
  private password: string;

  private taskFolders: Map<string, TaskFolder>;
  private taskIDToFolder: Map<TaskID, TaskFolder>;
  private univCredits: number;
  private streak: number;
 
  constructor(idMan: IDManager,
              username: string, password: string) {
    this.uniqueID = idMan.nextUserID(this);
    this.username = username;
    this.password = password;

    this.taskFolders = new Map<string, TaskFolder>();
    this.taskIDToFolder = new Map<TaskID, TaskFolder>();
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

  getTaskFolders(): Map<string, TaskFolder> {
    return this.taskFolders;
  }

  getTaskIDToFolders(): Map<TaskID, TaskFolder> {
    return this.taskIDToFolder;
  }

  // TODO: implement this
  getJSON(): string {
    return "";
  }
}