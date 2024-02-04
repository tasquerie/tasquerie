import { DateTime } from "../types/DateTime";
import { Duration } from "../types/Duration";
import { TaskID } from "../types/TaskID";
import { UserID } from "../types/UserID";
import { IDManager } from "./IDManager";

export class Task {
  private readonly uniqueID: TaskID;
  private name: string;
  private isComplete: boolean;
  private description: string;
  private tags: string[];
  private owner: UserID;
  private whoSharedWith: UserID[];

  private startDate?: DateTime;
  private cycleDuration?: Duration;
  private deadline?: DateTime;

  constructor(idMan: IDManager,
              name: string, description: string, tags: string[],
              owner: UserID, whoSharedWith: UserID[],
              startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime,
              ) {
    this.uniqueID = idMan.nextTaskID(this);
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

  getID(): TaskID {
    return this.uniqueID;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getIsComplete(): boolean {
    return this.isComplete;
  }

  setIsComplete(isComplete: boolean) {
    this.isComplete = isComplete;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string) {
    this.description = description;
  }

  getTags(): string[] {
    return this.tags;
  }

  getOwner(): UserID {
    return this.owner;
  }

  setOwner(owner: UserID) {
    this.owner = owner;
  }

  getWhoSharedWith(): UserID[] {
    return this.whoSharedWith;
  }

  getStartDate(): DateTime | undefined {
    return this.startDate;
  }

  getCycleDuration(): Duration | undefined {
    return this.cycleDuration;
  }

  getDeadline(): DateTime | undefined {
    return this.deadline;
  }

  // TODO: implement this
  getJSON(): string {
    return "";
  }
}

// Dummy function for testing
export function add(a: number, b: number): number {
  return a + b;
}