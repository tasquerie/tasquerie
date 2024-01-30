import { Egg } from "./Egg.ts";
import { Achievement } from "./Achievement.ts";
import { Task } from "./Task.ts";

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