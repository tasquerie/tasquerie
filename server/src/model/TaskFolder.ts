import { Egg } from "./Egg";
import { Task } from "./Task";

import { TaskID } from "../types/TaskID";

export class TaskFolder {
  private name: string;
  private description: string;
  private egg: Egg;

  private eggCredits: number;
  private taskIDtoTasks: Map<TaskID, Task>;

  constructor(name: string, description: string, eggType: string) {
    this.name = name;
    this.description = description;
    this.egg = new Egg(eggType);

    this.eggCredits = 0;
    this.taskIDtoTasks = new Map<TaskID, Task>();
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string) {
    this.description = description;
  }

  getEgg(): Egg {
    return this.egg;
  }

  getEggCredits(): number {
    return this.eggCredits;
  }

  setEggCredits(eggCredits: number) {
    this.eggCredits = eggCredits;
  }

  getTasks(): Map<TaskID, Task> {
    return this.taskIDtoTasks;
  }

  // TODO: implement this
  getJSON(): string {
    const jsonTaskFolder = {
      name: this.name,
      description: this.description,
      egg: this.egg,
      eggCredits: this.eggCredits,
      taskIDtoTasks: this.taskIDtoTasks,
    };
    return JSON.stringify(jsonTaskFolder);
  }
}