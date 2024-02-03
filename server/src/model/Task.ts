import { DateTime } from "../types/DateTime";
import { Duration } from "../types/Duration";
import { TaskID } from "../types/TaskID";
import { UserID } from "../types/UserID";
import { IDManager } from "./IDManager";

export class Task {
  uniqueID: TaskID;
  name: string;
  isComplete: boolean;
  description: string;
  tags: string[];
  owner: UserID;
  whoSharedWith: UserID[];

  startDate?: DateTime;
  cycleDuration?: Duration;
  deadline?: DateTime;

  constructor(idMan: IDManager,
              name: string, description: string, tags: string[],
              owner: UserID, whoSharedWith: UserID[],
              startDate: DateTime | undefined = undefined,
              cycleDuration: Duration | undefined = undefined,
              deadline: DateTime | undefined = undefined,
              ) {
    this.uniqueID = idMan.nextTaskID();
    this.name = name;
    this.isComplete = false;
    this.description = description;
    this.tags = tags;
    this.owner = owner;
    this.whoSharedWith = whoSharedWith;

    this.startDate = startDate;
    this.cycleDuration = cycleDuration;
    this.deadline = deadline;
  }
}

// Dummy function for testing
export function add(a: number, b: number): number {
  return a + b;
}