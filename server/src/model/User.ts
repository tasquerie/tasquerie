import { Egg } from "./Egg";
import { Achievement } from "./Achievement";
import { Task } from "./Task";
import { TaskFolder } from "./TaskFolder";

import { DateTime } from "../types/DateTime";
import { Duration } from "../types/Duration";

export class User {
  readonly uniqueID: number;
  username: string;
  password: string;  // will turn into bit array eventially for security
  tasks: Set<Task>;
  eggs: Egg[];
  achievements: Set<Achievement>;
  credits: number;
  streak: number;
 
  constructor(uniqueID: number, username: string, password: string) {
    this.uniqueID = uniqueID;
    this.username = username;
    this.password = password;
    this.tasks = new Set<Task>;
    this.eggs = [];
    this.achievements = new Set<Achievement>;
    this.credits = 0;
    this.streak = 0;
  }
}