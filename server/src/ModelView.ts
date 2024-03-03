import { EggManager } from "./model/EggManager";
import { IDManager } from "./model/IDManager";
import { Task } from "./model/Task";
import { TaskFolder } from "./model/TaskFolder";
import { User } from "./model/User";
import { TaskID } from "./types/TaskID";
import { UserID } from "./types/UserID";

export class ModelView {
  private idManager: IDManager;
  private eggManager: EggManager;

  constructor(idManager: IDManager, eggManager: EggManager) {
    this.idManager = idManager;
    this.eggManager = eggManager;
  }

  /**
   * Grabs the user info associated with the given userID.
   * Returns the string representation of the User object.
   * Returns undefined if user does not exist.
   *
   * @param id The userID you want to search for
   * @returns The string representation of the User object
   */
  async getUserInfo(id: UserID): Promise<string> {
    let user = (await this.idManager.getUserByID(id)).content;
    if (user === undefined) {
      return "";
    }

    user = user as User;
    return user.getJSON();
  }


  /**
   * Grabs the task info associated with the given UserID and TaskID.
   * Returns the string representation of the Task object.
   * Returns undefined if task does not exists for the given user.
   *
   * @param uid The UserID of the user
   * @param tid The TaskID of the task
   * @returns The string representation of the Task object
   */
  async getTaskInfo(uid: UserID, tid: TaskID): Promise<string> {
    let task = (await this.idManager.getTaskByID(uid, tid)).content;
    if (task === undefined) {
      return "";
    }
    task = task as Task;
    return task.getJSON();
  }


  /**
   * Grabs the info about a taskFolder given UserID and taskFolder name.
   * Returns the string representation of the taskFolder information.
   * Returns undefined if user does not exist or if the taskFolder does not exist.
   * @param uid The UserID of the user
   * @param folderName The name of the task folder
   * @returns The string representation of the Taskfolder
   */
  async getTaskFolderInfo(uid: UserID, folderName: string): Promise<string> {
    let user = (await this.idManager.getUserByID(uid)).content;
    if (user === undefined) {
      return "";
    }
    user = user as User;
    const taskFolder = user.getTaskFolders().get(folderName);
    if (taskFolder === undefined) {
      return "";
    }
    return taskFolder.getJSON();
  }


  /**
   * Grabs the info about the egg given UserID and the name of the taskFolder
   * @param uid The UserID of the user
   * @param folderName The name of the taskFolder which the egg is associated with
   * @returns The string representation of the Egg object
   */
  async getEggInfo(uid: UserID, folderName: string): Promise<string> {
    let user = (await this.idManager.getUserByID(uid)).content;
    if (user === undefined) {
      return "";
    }

    user = user as User;
    const taskFolder =  user.getTaskFolders().get(folderName);
    if (taskFolder === undefined) {
      return "";
    }
    return taskFolder.getEgg().getJSON();
  }


  /**
   *
   * @param name name of the eggType you want to query
   * @returns The string representation of the eggType object
   */
  getEggType(name: string): string {
    return this.eggManager.getEggTypeJSON(name);
  }


  /**
   *
   * @param name name of the interaction you want to query
   * @returns The string representation of the Interaction object
   */
  getInteraction(name: string): string {
    return this.eggManager.getInteractionJSON(name);
  }


  /**
   *
   * @param name name of the accessory you want to query
   * @returns The string representation of the Accessory object
   */
  getAccessory(name: string): string {
    return this.eggManager.getAccessoryJSON(name);
  }
}