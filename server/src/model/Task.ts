import { TaskID } from "../types/TaskID";
import { UserID } from "../types/UserID";
import { IDManager } from "./IDManager";

export class Task {
  private uniqueID: TaskID;
  private name: string;
  private isComplete: boolean;
  private description: string;
  private tags: string[];
  private owner: UserID;
  private whoSharedWith: UserID[];

  private startDate?: string;
  private cycleDuration?: string;
  private deadline?: string;

  constructor(taskID: TaskID,
              name: string, description: string, tags: string[],
              owner: UserID, whoSharedWith: UserID[],
              startDate?: string, cycleDuration?: string, deadline?: string,
              ) {
    this.uniqueID = taskID;
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

  setID(id: TaskID) {
    this.uniqueID = id;
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

  setTags(tags: string[]) {
    this.tags = tags;
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

  setWhoSharedWith(sharedWith: UserID[]) {
    this.whoSharedWith = sharedWith;
  }

  getStartDate(): string | undefined {
    return this.startDate;
  }

  setStartDate(startDate: string) {
    this.startDate = startDate;
  }

  getCycleDuration(): string | undefined {
    return this.cycleDuration;
  }

  setCycleDuration(cycleDuration: string) {
    this.cycleDuration = cycleDuration;
  }

  getDeadline(): string | undefined {
    return this.deadline;
  }

  setDeadline(deadline: string) {
    this.deadline = deadline;
  }

  // TODO: implement this
  getJSON(): string {
    const jsonTask = {
      uniqueID: this.uniqueID,
      name:this.name,
      isComplete: this.isComplete,
      description: this.description,
      tags:this.tags,
      owner:this.owner,
      whoSharedWith: this.whoSharedWith,
      startDate: this.startDate,
      cycleDuration: this.cycleDuration,
      deadline: this.deadline
    };
    return JSON.stringify(jsonTask);
  }

  toFirestoreObject(): object {
    return {
      uniqueID: this.uniqueID,
      name: this.name,
      isComplete: this.isComplete,
      description: this.description,
      tags: this.tags,
      owner: this.owner,
      whoSharedWith: this.whoSharedWith.map((userID) => userID.id),
      startDate: this.startDate,
      cycleDuration: this.cycleDuration,
      deadline: this.deadline,
    }

  }
}

// Dummy function for testing
export function add(a: number, b: number): number {
  return a + b;
}