import { User } from "./User";
import { Task } from "./Task";

import { TaskID } from "../types/TaskID";
import { UserID } from "../types/UserID";

export class IDManager {
  // ALL FIELDS FOR TESTING ONLY!!
  private USE_DB: boolean = false;
  readonly MAX_USER_ID = 1000000000;  // 10^9
  readonly MAX_TASK_ID = 1000000000 ; // 10^9
  private userIDToUser: Map<number, User | undefined>;
  private taskIDToTask: Map<number, Task | undefined>;
 
  // CONSTRUCTOR FOR TESTING ONLY!!
  constructor() {
    this.userIDToUser = new Map<number, User | undefined>;
    this.taskIDToTask = new Map<number, Task | undefined>;
  }

  // TODO: Integrate with database
  public nextUserID(user: User | undefined): UserID {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      var next_id = Math.floor(Math.random() * this.MAX_USER_ID);
      while (this.userIDToUser.has(next_id)) {
        next_id = Math.floor(Math.random() * this.MAX_USER_ID);
      }
      this.userIDToUser.set(next_id, user);

      const idObj: UserID = {
        id: next_id
      };
      return idObj;
    }
  }

  // TODO: Integrate with database
  public nextTaskID(task: Task | undefined): TaskID {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      // temporary. will be replaced by call to DB later
      var next_id = Math.floor(Math.random() * this.MAX_TASK_ID);
      while (this.taskIDToTask.has(next_id)) {
        next_id = Math.floor(Math.random() * this.MAX_TASK_ID);
      }
      this.taskIDToTask.set(next_id, task);

      const idObj: TaskID = {
        id: next_id
      };
      return idObj;
    }
  }

  public getUserByID(userID: UserID): User | undefined {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      return this.userIDToUser.get(userID.id);
    }
  }

  public getTaskByID(taskID: TaskID): Task | undefined {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      return this.taskIDToTask.get(taskID.id);
    }
  }
}