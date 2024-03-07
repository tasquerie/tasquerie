import { TaskID } from "../types/TaskID";
import { UserID } from "../types/UserID";

export class Task {
  private userID: UserID;
  private uniqueID: TaskID;
  private name: string;
  private isComplete: boolean;
  private description: string;
  // private tags: string[];

  private startDate?: string;
  // private cycleDuration?: string;
  private endDate?: string;

  constructor(userID: UserID, taskID: TaskID,
              name: string, description: string, //tags: string[],
              startDate?: string, endDate?: string,
              ) {
    this.userID = userID;
    this.uniqueID = taskID;
    this.name = name;
    this.isComplete = false;
    this.description = description;
    // this.tags = tags;

    this.startDate = startDate;
    this.endDate = endDate;
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

  // getTags(): string[] {
  //   return this.tags;
  // }

  // setTags(tags: string[]) {
  //   this.tags = tags;
  // }

  getStartDate(): string | undefined {
    return this.startDate;
  }

  setStartDate(startDate: string) {
    this.startDate = startDate;
  }

  getendDate(): string | undefined {
    return this.endDate;
  }

  setendDate(endDate: string) {
    this.endDate = endDate;
  }

  // TODO: implement this
  getJSON(): string {
    const jsonTask = {
      uniqueID: this.uniqueID,
      name:this.name,
      isComplete: this.isComplete,
      description: this.description,
      // tags:this.tags,
      startDate: this.startDate,
      endDate: this.endDate
    };
    return JSON.stringify(jsonTask);
  }

  toFirestoreObject(): object {
    return {
      uniqueID: this.uniqueID,
      name: this.name,
      isComplete: this.isComplete,
      description: this.description,
      // tags: this.tags,
      startDate: this.startDate,
      endDate: this.endDate,
    }

  }
}
