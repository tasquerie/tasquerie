import { Egg } from "./model/Egg";
import { EggManager } from "./model/EggManager";
import { IDManager } from "./model/IDManager";
import { Task } from "./model/Task";
import { TaskFolder } from "./model/TaskFolder";
import { User } from "./model/User";
import { UserManager } from "./model/UserManager";
import { WriteManager } from "./model/WriteManager";
import { DateTime } from "./types/DateTime";
import { Duration } from "./types/Duration";
import { TaskID } from "./types/TaskID";
import { UserID } from "./types/UserID";

export class ModelController {
  public readonly USER_NOT_SIGNED_IN: string;
  public readonly NEGATIVE_VALUE: string;
  private userManager: UserManager;
  private idManager: IDManager;
  private eggManager: EggManager;
  private writeManager: WriteManager;
  private currentUser?: User;

  constructor(userManager: UserManager, idManager: IDManager, eggManager: EggManager,
              writeManager: WriteManager) {
    this.USER_NOT_SIGNED_IN = 'Illegal operation: user is not signed-in!';
    this.NEGATIVE_VALUE = 'Illegal operation: negative credit value';
    this.userManager = userManager;
    this.idManager = idManager;
    this.eggManager = eggManager;
    this.writeManager = writeManager;
    this.currentUser = undefined;
  }

  // login methods
  // TODO: implement this
  // TODO: test me
  login(username: string, password: string): boolean {
    this.currentUser = this.userManager.getUserFromLogin(username, password);
    return this.currentUser !== undefined;
  }

  // TODO: implement this (may need DB call?)
  // TODO: test me
  logout(): void {
    this.currentUser = undefined;
  }

  // TODO: implement this
  // TODO: test me
  async signup(username: string, password: string): Promise<string> {
    let exists: boolean = await this.userManager.usernameExists(username);
    if (exists) {
      console.log("DEBUG: user already there.");
      throw new Error('Username already exists!');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    this.currentUser = new User(this.idManager, username, password);
    if (!this.userManager.USE_DB) {
      // for testing only
      this.userManager.addUser(username, password, this.currentUser);
    }
    await this.writeUserToDB();
    return this.currentUser.getID().id;
  }

  // PRIVATE HELPERS
  // If user is not signed-in, throws an Error.
  private async writeUserToDB() {
    if (this.currentUser !== undefined) {
       await this.writeManager.writeUser(this.currentUser);
    }
  }

  private async writeTaskToDB(task: Task) {
    await this.writeManager.writeTask(task);
  }

  private async deleteTaskFromDB(task: Task) {
    if (!this.idManager.USE_DB) {
      this.idManager.deleteTaskID(task.getID());
    }
    await this.writeManager.deleteTask(task);
  }
  public isLoggedIn(): boolean {
    // for testing only.
    return this.currentUser !== undefined;
  }
  public getCurrentUser(): User | undefined {
    // for testing only.
    return this.currentUser;
  }
  public getIDManager(): IDManager {
    // for testing only.
    return this.idManager;
  }
  public getEggManager(): EggManager {
    // for testing only.
    return this.eggManager;
  }



  // data manipulation methods
  // TODO: implement this
  // TODO: test me
  async addFolder(name: string, description: string, eggType: string): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    if (taskFolderMap.has(name)) {
      throw new Error('Duplicated value: the given folder name already exists');
    }
    const newFolder = new TaskFolder(name, description, eggType);
    taskFolderMap.set(name, newFolder);
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async setFolder(name: string, newName?: string, description?: string): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(name);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    if (newName !== undefined && taskFolderMap.has(newName)) {
      throw new Error('Duplicated value: the new folder name already exists');
    }
    if (newName !== undefined) {
      folder.setName(newName);
      this.currentUser.getTaskFolders().set(newName, folder);
      this.currentUser.getTaskFolders().delete(name);
    }
    if (description !== undefined) {
      folder.setDescription(description);
    }
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async deleteFolder(name: string): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(name);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    let taskIDtoTask = folder.getTasks();
    taskIDtoTask.forEach(async (value: Task, key: TaskID) => {
      await this.deleteTaskFromDB(value);
    })
    taskFolderMap.delete(name);  // remove task folder
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async addTask(folderName: string, taskName: string, description: string, tags: string[],
          whoSharedWith: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): Promise<TaskID> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    let folder = this.currentUser.getTaskFolders().get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    let task = new Task(this.idManager,
                        taskName, description, tags, this.currentUser.getID(),
                        whoSharedWith, startDate, cycleDuration, deadline);
    folder.getTasks().set(task.getID(), task);  // add task to folder
    await this.writeTaskToDB(task);
    await this.writeUserToDB();
    return task.getID();
  }

  // TODO: implement this
  // TODO: test me
  async setTask(folderName: string, id: TaskID, isComplete?: boolean, taskName?: string,
          description?: string, tags?: string[], whoSharedWith?: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    let taskIDtoTask = folder.getTasks();
    let task = taskIDtoTask.get(id);
    if (task === undefined) {
      throw new Error('The taskID does not exist in this folder');
    }
    if (isComplete !== undefined) {
      task.setIsComplete(isComplete);
    }
    if (taskName !== undefined) {
      task.setName(taskName);
    }
    if (description !== undefined) {
      task.setDescription(description);
    }
    if (tags !== undefined) {
      task.setTags(tags);
    }
    if (whoSharedWith !== undefined) {
      task.setWhoSharedWith(whoSharedWith);
    }
    if (startDate !== undefined) {
      task.setStartDate(startDate);
    }
    if (cycleDuration !== undefined) {
      task.setCycleDuration(cycleDuration);
    }
    if (deadline !== undefined) {
      task.setDeadline(deadline);
    }
    await this.writeTaskToDB(task);
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async deleteTask(folderName: string, id: TaskID): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    let taskIDtoTask = folder.getTasks();
    let task = taskIDtoTask.get(id);
    if (task === undefined) {
      throw new Error('The taskID does not exist in this folder');
    }
    folder.getTasks().delete(id);
    await this.deleteTaskFromDB(task);
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async addUnivCredits(amount: number): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    const sum = this.currentUser.getUnivCredits() + amount;
    this.currentUser.setUnivCredits(sum);
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async removeUnivCredits(amount: number): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    const diff = this.currentUser.getUnivCredits() - amount;
    this.currentUser.setUnivCredits(diff);
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async addEggCredits(amount: number, folderName: string): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    const sum = folder.getEggCredits() + amount;
    folder.setEggCredits(sum);
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async removeEggCredits(amount: number, folderName: string): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    const diff = folder.getEggCredits() - amount;
    folder.setEggCredits(diff);
    await this.writeUserToDB();
  }

  // TODO: implement this
  // TODO: test me
  async buyAccessory(folderName: string, accesssoryType: string): Promise<boolean> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    const eggTypeName = folder.getEgg().getEggType();
    const eggType = this.eggManager.getEggType(eggTypeName);
    if (eggType === undefined) {
      throw new Error('Impossible: undefined eggType');
    }
    if (!eggType.allowedAccessories.has(accesssoryType)) {
      throw new Error('not allowed to buy this accessory');
    }
    if (folder.getEgg().getEquippedAccessories().has(accesssoryType)) {
      throw new Error('you already purchased this accessory');
    }
    const accessory = this.eggManager.getAccessory(accesssoryType);
    if (accessory === undefined) {
      throw new Error('Impossible: undefined accessory');
    }
    const eggCred = folder.getEggCredits();
    const univCred = this.currentUser.getUnivCredits();
    if (eggCred + univCred < accessory.cost) {
      return false;  // not enough credits to buy this accessory
    }

    // actual purchase
    if (eggCred >= accessory.cost) {
      await this.removeEggCredits(accessory.cost, folderName);
    } else {
      await this.removeEggCredits(eggCred, folderName);
      await this.removeUnivCredits(accessory.cost - eggCred);
    }
    // adding the actual accessory
    folder.getEgg().getEquippedAccessories().add(accesssoryType);

    await this.writeUserToDB();
    return true;
  }

  // TODO: implement this
  // TODO: test me
  async buyInteraction(folderName: string, interactionType: string): Promise<boolean> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    const eggTypeName = folder.getEgg().getEggType();
    const eggType = this.eggManager.getEggType(eggTypeName);
    if (eggType === undefined) {
      throw new Error('Impossible: undefined eggType');
    }
    if (!eggType.allowedInteractions.has(interactionType)) {
      throw new Error('not allowed to buy this interaction')
    }
    const interaction = this.eggManager.getInteraction(interactionType);
    if (interaction === undefined) {
      throw new Error('Impossible: undefined interaction');
    }
    const eggCred = folder.getEggCredits();
    const univCred = this.currentUser.getUnivCredits();
    if (eggCred + univCred < interaction.cost) {
      return false;  // not enough credits to buy this accessory
    }

    // actual purchase
    if (eggCred >= interaction.cost) {
      await this.removeEggCredits(interaction.cost, folderName);
    } else {
      await this.removeEggCredits(eggCred, folderName);
      await this.removeUnivCredits(interaction.cost - eggCred);
    }
    // applying the actual interaction -> gain exp
    await this.gainExp(interaction.expGained, folderName);

    await this.writeUserToDB();
    return true;
  }

  // TODO: implement this
  // TODO: test me
  async gainExp(amount: number, folderName: string): Promise<void> {
    if (this.currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = this.currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }

    // raise exp
    const newExp = folder.getEgg().getExp() + amount;
    folder.getEgg().setExp(newExp);

    // raise evolution level
    const eggTypeName = folder.getEgg().getEggType();
    const eggType = this.eggManager.getEggType(eggTypeName);
    if (eggType === undefined) {
      throw new Error('Impossible: undefined eggType');
    }
    let levelBounds: number[] = eggType.levelBoundaries;
    for (let i = 0; i < levelBounds.length; i++) {
      if (newExp >= levelBounds[i]) {
        folder.getEgg().setEggStage(i + 1);
      }
    }


    await this.writeUserToDB();
  }
}