import { EggManager } from "./model/EggManager";
import { IDManager } from "./model/IDManager";
import { TaskFolder } from "./model/TaskFolder";
import { TaskID } from "./types/TaskID";
import { UserID } from "./types/UserID";

export class ModelView {
  private idManager: IDManager;
  private eggManager: EggManager;

  constructor(idManager: IDManager, eggManager: EggManager) {
    this.idManager = idManager;
    this.eggManager = eggManager;
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  async getUserInfo(id: UserID): Promise<string> {
    const user = await this.idManager.getUserByID(id);
    if (user === undefined) {
      return "";
    }
    return user.getJSON();
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  async getTaskInfo(uid: UserID, tid: TaskID): Promise<string> {
    const task = await this.idManager.getTaskByID(uid, tid);
    if (task === undefined) {
      return "";
    }
    return task.getJSON();
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  async getTaskFolderInfo(id: UserID, folderName: string): Promise<string> {
    const user = await this.idManager.getUserByID(id);
    if (user === undefined) {
      return "";
    }
    const taskFolder = user.getTaskFolders().get(folderName);
    if (taskFolder === undefined) {
      return "";
    }
    return taskFolder.getJSON();
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  async getEggInfo(id: UserID, folderName: string): Promise<string> {
    const user = await this.idManager.getUserByID(id);
    if (user === undefined) {
      return "";
    }
    const taskFolder =  user.getTaskFolders().get(folderName);
    if (taskFolder === undefined) {
      return "";
    }
    return taskFolder.getEgg().getJSON();
  }

  // TODO: test me
  getEggType(name: string): string {
    return this.eggManager.getEggTypeJSON(name);
  }

  // TODO: test me
  getInteraction(name: string): string {
    return this.eggManager.getInteractionJSON(name);
  }

  // TODO: test me
  getAccessory(name: string): string {
    return this.eggManager.getAccessoryJSON(name);
  }
}