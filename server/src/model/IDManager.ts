import { User } from "./User";
import { Task } from "./Task";

import { TaskID } from "../types/TaskID";
import { UserID } from "../types/UserID";
import { FirebaseUserAPI, FirebaseTaskAPI } from "../firebaseAPI";
import { Result } from "../types/FirebaseResult";
const currentTime = new Date();

export class IDManager {
  // ALL FIELDS FOR TESTING ONLY!!
  public USE_DB: boolean = false;
  readonly MAX_USER_ID = 1000000000;  // 10^9
  readonly MAX_TASK_ID = 1000000000 ; // 10^9
  private userIDToUser: Map<string, User | undefined>;
  private taskIDToTask: Map<string, Task | undefined>;
  // CONSTRUCTOR FOR TESTING ONLY!!
  constructor() {
    this.userIDToUser = new Map<string, User | undefined>;
    this.taskIDToTask = new Map<string, Task | undefined>;
  }

  // TODO: Integrate with database
  public nextUserID(user: User | undefined): UserID {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    } else {
      var next_id = Math.floor(Math.random() * this.MAX_USER_ID);
      while (this.userIDToUser.has(next_id.toString())) {
        next_id = Math.floor(Math.random() * this.MAX_USER_ID);
      }
      this.userIDToUser.set(next_id.toString(), user);

      const idObj: UserID = {
        id: next_id.toString()
      };
      return idObj;
    }
  }

  public nextTaskID(task: Task | undefined): TaskID {
    if (this.USE_DB) {
      const temp = task?.getStartDate();
      const year: number = temp?.year as number;
      const month: number = temp?.month as number;
      const day = temp?.day;
      const hour = temp?.hour;
      const minute = temp?.minute;

      const date = new Date(year, month - 1, day, hour, minute);
      const time = date.getTime();
      const UNIXtime = Math.floor(time / 1000);

      const newTaskID: TaskID = {
        id: UNIXtime.toString()
      }
      this.taskIDToTask.set(UNIXtime.toString(), task)
      return newTaskID;

    } else {
      // temporary. will be replaced by call to DB later
      var next_id = Math.floor(Math.random() * this.MAX_TASK_ID);
      while (this.taskIDToTask.has(next_id.toString())) {
        next_id = Math.floor(Math.random() * this.MAX_TASK_ID);
      }
      this.taskIDToTask.set(next_id.toString(), task);

      const idObj: TaskID = {
        id: next_id.toString()
      };
      return idObj;
    }
  }

  public async getUserByID(userID: UserID): Promise<Result> {
    if (this.USE_DB) {
      const result = await FirebaseUserAPI.getUser(userID);
      return result;
    } else {
      return {status: true, content: this.userIDToUser.get(userID.id)}
    }
  }

    // TODO: Under fix --------------------------------------------------
  public async getTaskByID(userID: UserID, taskID: TaskID): Promise<Result> {
    if (this.USE_DB) {
      const result = await FirebaseTaskAPI.getTask(userID, taskID);
      return result;
    } else {
      return { status: true, content: this.taskIDToTask.get(taskID.id)}
    }
  }

  // for testing only
  public deleteTaskID(taskID: TaskID) {
    if (!this.USE_DB) {
      this.taskIDToTask.delete(taskID.id);
    }
  }
}