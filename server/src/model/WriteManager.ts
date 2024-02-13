import { Task } from "./Task";
import { User } from "./User";

export class WriteManager {
  // ALL FIELDS FOR TESTING ONLY!!
  private USE_DB: boolean = false;

  // TODO: integrate with database
  public writeUser(user: User) {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    }
    // nothing to write if no DB exists....
  }

  // TODO: integrate with database
  public writeTask(task: Task) {
    if (this.USE_DB) {
      throw new Error("not Implemented");
    }
    // nothing to write if no DB exists....
  }
}