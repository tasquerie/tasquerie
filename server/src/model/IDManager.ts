import { TaskID } from "../types/TaskID";
import { UserID } from "../types/UserID";

export class IDManager {
  readonly MAX_USER_ID = 1000000000  // 10^9
  readonly MAX_TASK_ID = 1000000000  // 10^9

  user_ids: Set<number>;
  task_ids: Set<number>;
 
  constructor() {
    this.user_ids = new Set<number>;
    this.task_ids = new Set<number>;
  }

  public nextTaskID(): TaskID {
    // temporary. will be replaced by call to DB later
    var next_id = Math.floor(Math.random() * this.MAX_TASK_ID);
    while (this.task_ids.has(next_id)) {
      next_id = Math.floor(Math.random() * this.MAX_TASK_ID);
    }
    this.task_ids.add(next_id);

    const idObj: TaskID = {
      id: next_id
    };
    return idObj;
  }

  public nextUserID(): UserID {
    // temporary. will be replaced by call to DB later
    var next_id = Math.floor(Math.random() * this.MAX_USER_ID);
    while (this.user_ids.has(next_id)) {
      next_id = Math.floor(Math.random() * this.MAX_USER_ID);
    }
    this.user_ids.add(next_id);

    const idObj: UserID = {
      id: next_id
    };
    return idObj;
  }
}