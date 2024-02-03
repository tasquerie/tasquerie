import { Egg } from "./Egg";
import { Task } from "./Task";

import { TaskID } from "../types/TaskID";

export class TaskFolder {
  name: string;
  description: string;
  egg: Egg;

  credits: number;
  tasks: Map<TaskID, Task>;

  constructor(name: string, description: string, eggType: string) {
    this.name = name;
    this.description = description;
    this.egg = new Egg(eggType);

    this.credits = 0;
    this.tasks = new Map<TaskID, Task>();
  }
}