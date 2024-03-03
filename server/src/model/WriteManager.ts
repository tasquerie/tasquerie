import { Task } from "./Task";
import { User } from "./User";
import { Result } from "./../types/FirebaseResult"
import { FirebaseUserAPI, FirebaseTaskAPI } from "../firebaseAPI";
export class WriteManager {
  // ALL FIELDS FOR TESTING ONLY!!
  private USE_DB: boolean = false;

  // TODO: integrate with database
  public async writeUser(user: User): Promise<string | undefined> {
    if (this.USE_DB) {
      // throw new Error("not Implemented");
      const output = await FirebaseUserAPI.addUser(user);
      return output.content?.toString();
    }
    throw new Error("If writing to db causes error and needs testing");
    // nothing to write if no DB exists....
  }

  // TODO: integrate with database
  public async writeTask(task: Task) {
    if (this.USE_DB) {
      // throw new Error("not Implemented");
      const output = await FirebaseTaskAPI.addTask(task);
      return output;
    }
    throw new Error("If writing to db causes error and needs testing");
    // nothing to write if no DB exists....
  }

  // TODO: integrate with database
  public async deleteTask(task: Task) {
    if (this.USE_DB) {
      // throw new Error("not Implemented");
      const output = await FirebaseTaskAPI.removeTask(task);
      return output
    }
    throw new Error("If writing to db causes error and needs testing");
    // nothing to delete if no DB exists....
  }
}