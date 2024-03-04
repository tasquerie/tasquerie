import { Egg } from "./model/Egg";
import { EggManager } from "./model/EggManager";
import { IDManager } from "./model/IDManager";
import { Task } from "./model/Task";
import { TaskFolder } from "./model/TaskFolder";
import { User } from "./model/User";
import { UserManager } from "./model/UserManager";
import { WriteManager } from "./model/WriteManager";
import { TaskID } from "./types/TaskID";
import { UserID } from "./types/UserID";

// for testing
const TEMP_ID: UserID = {
  id: "NULL"
};

const TEMP_ID_TASK: TaskID = {
  id: "NULL"
};

export class ModelController {
  public readonly USER_NOT_SIGNED_IN: string;
  public readonly NEGATIVE_VALUE: string;
  private userManager: UserManager;
  private idManager: IDManager;
  private eggManager: EggManager;
  private writeManager: WriteManager;
  private currentUser?: User;  // KEPT ONLY FOR TESTING PURPOSES!!

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
    let exists: boolean = this.userManager.usernameExists(username);
    if (exists) {
      // console.log("DEBUG: user already there.");
      throw new Error('Username already exists!');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    this.currentUser = new User(TEMP_ID, username, password);
    this.currentUser.setID(this.idManager.nextUserID(this.currentUser));
    if (!this.userManager.USE_DB) {
      // for testing only
      this.userManager.addUser(username, password, this.currentUser);
    }
    await this.writeUserToDB(this.currentUser);
    return this.currentUser.getID().id;
  }

  // PRIVATE HELPERS
  // If user is not signed-in, throws an Error.
  private async writeUserToDB(user: User) {
    await this.writeManager.writeUser(user);
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
  async addFolder(userID: UserID, name: string, description: string, eggType: string): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
    if (taskFolderMap.has(name)) {
      throw new Error('Duplicated value: the given folder name already exists');
    }
    const newFolder = new TaskFolder(name, description, eggType);
    taskFolderMap.set(name, newFolder);
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async setFolder(userID: UserID, name: string, newName?: string, description?: string): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
    const folder = taskFolderMap.get(name);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    if (newName !== undefined && taskFolderMap.has(newName)) {
      throw new Error('Duplicated value: the new folder name already exists');
    }
    if (newName !== undefined) {
      folder.setName(newName);
      currentUser.getTaskFolders().set(newName, folder);
      currentUser.getTaskFolders().delete(name);
    }
    if (description !== undefined) {
      folder.setDescription(description);
    }
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async deleteFolder(userID: UserID, name: string): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
    const folder = taskFolderMap.get(name);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    let taskIDtoTask = folder.getTasks();
    taskIDtoTask.forEach(async (value: Task, key: TaskID) => {
      await this.deleteTaskFromDB(value);
    })
    taskFolderMap.delete(name);  // remove task folder
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async addTask(userID: UserID, folderName: string, taskName: string, description: string, tags: string[],
          whoSharedWith: UserID[],
          startDate?: string, cycleDuration?: string, deadline?: string): Promise<TaskID> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    let folder = currentUser.getTaskFolders().get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    let task = new Task(TEMP_ID_TASK,
                        taskName, description, tags, currentUser.getID(),
                        whoSharedWith, startDate, cycleDuration, deadline);
    task.setID(this.idManager.nextTaskID(task));
    
    folder.getTasks().set(task.getID(), task);  // add task to folder
    await this.writeTaskToDB(task);
    await this.writeUserToDB(currentUser);
    return task.getID();
  }

  // TODO: implement this
  // TODO: test me
  async setTask(userID: UserID, id: TaskID, isComplete?: boolean, taskName?: string,
          description?: string, tags?: string[], whoSharedWith?: UserID[],
          startDate?: string, cycleDuration?: string, deadline?: string): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    const task = (await this.idManager.getTaskByID(userID, id)).content as Task | undefined;
    if (task === undefined) {
      throw new Error('The taskID does not exist');
    }
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
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async deleteTask(userID: UserID, folderName: string, id: TaskID): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
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
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async addUnivCredits(userID: UserID, amount: number): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    const sum = currentUser.getUnivCredits() + amount;
    currentUser.setUnivCredits(sum);
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async removeUnivCredits(userID: UserID, amount: number): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    const diff = currentUser.getUnivCredits() - amount;
    currentUser.setUnivCredits(diff);
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async addEggCredits(userID: UserID, amount: number, folderName: string): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    const sum = folder.getEggCredits() + amount;
    folder.setEggCredits(sum);
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async removeEggCredits(userID: UserID, amount: number, folderName: string): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    const diff = folder.getEggCredits() - amount;
    folder.setEggCredits(diff);
    await this.writeUserToDB(currentUser);
  }

  // TODO: implement this
  // TODO: test me
  async buyAccessory(userID: UserID, folderName: string, accesssoryType: string): Promise<boolean> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
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
    if (folder.getEgg().getOwnedAccessories().has(accesssoryType)) {
      throw new Error('you already purchased this accessory');
    }
    const accessory = this.eggManager.getAccessory(accesssoryType);
    if (accessory === undefined) {
      throw new Error('Impossible: undefined accessory');
    }
    const eggCred = folder.getEggCredits();
    const univCred = currentUser.getUnivCredits();
    if (eggCred + univCred < accessory.cost) {
      return false;  // not enough credits to buy this accessory
    }

    // actual purchase
    if (eggCred >= accessory.cost) {
      await this.removeEggCredits(userID, accessory.cost, folderName);
    } else {
      await this.removeEggCredits(userID, eggCred, folderName);
      await this.removeUnivCredits(userID, accessory.cost - eggCred);
    }
    // adding the actual accessory
    folder.getEgg().getOwnedAccessories().add(accesssoryType);

    await this.writeUserToDB(currentUser);
    return true;
  }

  // TODO: implement this
  // TODO: test me
  async buyInteraction(userID: UserID, folderName: string, interactionType: string): Promise<boolean> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
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
    const univCred = currentUser.getUnivCredits();
    if (eggCred + univCred < interaction.cost) {
      return false;  // not enough credits to buy this accessory
    }

    // actual purchase
    if (eggCred >= interaction.cost) {
      await this.removeEggCredits(userID, interaction.cost, folderName);
    } else {
      await this.removeEggCredits(userID, eggCred, folderName);
      await this.removeUnivCredits(userID, interaction.cost - eggCred);
    }
    // applying the actual interaction -> gain exp
    await this.gainExp(userID, interaction.expGained, folderName);

    await this.writeUserToDB(currentUser);
    return true;
  }

  // TODO: implement this
  // TODO: test me
  async gainExp(userID: UserID, amount: number, folderName: string): Promise<void> {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    if (amount < 0) {
      throw new Error(this.NEGATIVE_VALUE);
    }
    // reference to the taskfolder of the current user.
    const taskFolderMap = currentUser.getTaskFolders();
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


    await this.writeUserToDB(currentUser);
  }

  async equipAccesssory(userID: UserID, folderName: string, accesory: string) {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    const taskFolderMap = currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    if (folder.getEgg().getOwnedAccessories().has(accesory)) {
      folder.getEgg().getEquippedAccessories().add(accesory);
    }
    await this.writeUserToDB(currentUser);
  }

  async unequipAccesssory(userID: UserID, folderName: string, accesory: string) {
    const currentUser = (await this.idManager.getUserByID(userID)).content as User | undefined;
    if (currentUser === undefined) {
      throw new Error(this.USER_NOT_SIGNED_IN);
    }
    const taskFolderMap = currentUser.getTaskFolders();
    const folder = taskFolderMap.get(folderName);
    if (folder === undefined) {
      throw new Error('The folder name does not exist');
    }
    folder.getEgg().getEquippedAccessories().delete(accesory);
    await this.writeUserToDB(currentUser);
  }
}