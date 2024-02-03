import { Egg } from "./Egg";
import { Achievement } from "./Achievement";
import { Task } from "./Task";
import { TaskFolder } from "./TaskFolder";

import { UserID } from "../types/UserID";
import { TaskID } from "../types/TaskID";
import { DateTime } from "../types/DateTime";
import { Duration } from "../types/Duration";

export class User {
  readonly uniqueID: UserID;
  username: string;
  password: string;

  taskFolders: Map<string, TaskFolder>;
  taskIDToFolder: Map<TaskID, TaskFolder>;
  univCredits: number;
  streak: number;
 
  constructor(uniqueID: UserID, username: string, password: string) {
    this.uniqueID = uniqueID;
    this.username = username;
    this.password = password;

    this.taskFolders = new Map<string, TaskFolder>();
    this.taskIDToFolder = new Map<TaskID, TaskFolder>;
    this.univCredits = 0;
    this.streak = 0;
  }
}