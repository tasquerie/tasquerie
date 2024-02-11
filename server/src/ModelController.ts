import { Egg } from "./model/Egg";
import { IDManager } from "./model/IDManager";
import { Task } from "./model/Task";
import { TaskFolder } from "./model/TaskFolder";
import { User } from "./model/User";
import { DateTime } from "./types/DateTime";
import { Duration } from "./types/Duration";
import { TaskID } from "./types/TaskID";
import { UserID } from "./types/UserID";

export class ModelController {
  currentUserID?: UserID;
  currentUser?: User;

  constructor() {
    this.currentUserID = undefined;
    this.currentUser = undefined;
  }

  // login methods
  // TODO: implement this
  login(username: string, password: string): boolean {
    // TODO: 
    // 1. need to find the user with the currentUserID from the database
    // 2. set the currentUser as a reference
    return true;
  }

  // TODO: implement this (may need DB call?)
  logout(): void {
    this.currentUserID = undefined;
    this.currentUser = undefined;
  }

  // TODO: implement this
  signup(username: string, password: string): void {
    //TODO: sets the user in the database
  }

  // If user is not signed-in, throws an Error.
  private assertUserIsSignedIn(): void {
    if (this.currentUserID === undefined || this.currentUser === undefined) {
      throw new Error('Illegal operation: user is not signed-in!');
    }
  }


  // data manipulation methods
  // TODO: implement this
  addFolder(name: string, description: string, egg: Egg): void {
    this.assertUserIsSignedIn();

    // reference to the taskfolder of the current user.
    const taskFolderMap:Map<string, TaskFolder> | undefined = this.currentUser?.getTaskFolders();

    if (taskFolderMap === undefined) {
      throw new Error('NoSuchElement: the taskfolder of the user is not defined');
    } else if (taskFolderMap.has(name)) {
      throw new Error('Duplicated value: the given name already exists');
    }

    const eggType = egg.getEggType();
    const newFolder = new TaskFolder(name, description, eggType);
    taskFolderMap.set(name, newFolder);

    // Add the folder to the database
  }

  // TODO: implement this
  // CHECK: if newName and description is the same as before... then throw error?
  setFolder(name: string, newName?: string, description?: string): void {
    this.assertUserIsSignedIn();

    if (newName === undefined && description === undefined) {
      throw new Error("MissingInfo: required information for adding folder is missing."
                      + "Need either a new name or new description");
    }

    // reference to the taskfolder of the current user.
    const taskFolderMap:Map<string, TaskFolder> | undefined = this.currentUser?.getTaskFolders();

    if (taskFolderMap === undefined) {
      throw new Error('NoSuchElement: the taskfolder of the user is not defined');
    } else if (!taskFolderMap.has(name)) {
      throw new Error('NoSuchElement: the name of the taskFolder does not exist');
    }

    const taskFolder = taskFolderMap.get(name);
    // This will not happen but for safety
    if (taskFolder === undefined) {
      throw new Error("NoSuchElement: the taskFolder has a name but is not defined");
    }

    if (newName !== undefined) {
      taskFolder.setName(newName);
    }

    if (description !== undefined) {
      taskFolder.setDescription(description);
    }

    // Check: Do we need to create a TaskFolder with the changed values? to add to the database
    // Set the folder to the database
  }

  // TODO: implement this
  deleteFolder(name: string): void {
    this.assertUserIsSignedIn();

    const taskFolderMap:Map<string, TaskFolder> | undefined = this.currentUser?.getTaskFolders();

    if (taskFolderMap === undefined) {
      throw new Error('NoSuchElement: the taskfolder of the user is not defined');
    }
    
    // map.delete(key) deletes the key-value pair and return if it successfully deleted.
    if (!taskFolderMap.delete(name)) {
      throw new Error('NoSuchElement: the name of the taskFolder does not exist');
    }

    // Remove the folder from the database
  }

  // TODO: implement this
  addTask(folderName: string, taskName: string, description: string, tags: string[],
          whoSharedWith: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): void {
    this.assertUserIsSignedIn();

    const taskFolderMap:Map<string, TaskFolder> | undefined = this.currentUser?.getTaskFolders();

    if (taskFolderMap === undefined) {
      throw new Error('NoSuchElement: the taskfolder of the user is not defined');
    }

    const taskFolder = taskFolderMap.get(folderName);
    if (taskFolder === undefined) {
      throw new Error('NoSuchElement: the taskfolder does not exist');
    }

    // CHECK: correct use of ID Manager?
    const idMan = new IDManager();
    if (this.currentUserID === undefined) {
      throw new Error('NoSuchElement: can not find the current user id');
    }
    const task = new Task(idMan, taskName, description, tags, this.currentUserID, whoSharedWith, startDate, cycleDuration, deadline);

    // database:
  }

  // TODO: implement this
  setTask(id: TaskID, isComplete?: boolean, taskName?: string,
          description?: string, tags?: string[], whoSharedWith?: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): void {
    this.assertUserIsSignedIn();

    // CHECK: IDManager
    const idMan = new IDManager();
    const task = idMan.getTaskByID(id);
    if (task === undefined) {
      throw new Error('NoSuchElement: task does not exist');
    }

    if (taskName === undefined) {
      throw new Error('NoSuchElement: task does not exist');
    } 
    const newDesc = (description === undefined) ? task.getDescription() : description;
    const newTags = (tags === undefined) ? task.getTags() : tags;
    const newShared = (whoSharedWith === undefined) ? task.getWhoSharedWith() : whoSharedWith;
    // CHECK: Need to consider the case of the owner getting switched.
    // CHECK: Are we setting new task id when we are changing features?
    const newTask = new Task(idMan, taskName, newDesc, newTags, task.getOwner(), newShared, startDate, cycleDuration, deadline);
    // CHECK: Need some sort of way to update the task(reference, method).
    
  }

  // TODO: implement this
  deleteTask(id: TaskID): void {
    this.assertUserIsSignedIn();

    const idMan = new IDManager();
    const task = idMan.getTaskByID(id);
    if (task === undefined) {
      throw new Error('NoSuchElement: task does not exist');
    }

    // CHECK: Doc says to call IDManager.removeTaskID() but doesn't exist

    // CHECK: Need some sort of way to update the task(reference, method).
  }

  // TODO: implement this
  addUnivCredits(amount: number): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {

    }
  }

  // TODO: implement this
  removeUnivCredits(amount: number): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {
      
    }
  }

  // TODO: implement this
  addEggCredits(amount: number, folderName: string): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {

    }
  }

  // TODO: implement this
  removeEggCredits(amount: number, folderName: string): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {
      
    }
  }

  // TODO: implement this
  buyAccessory(folderName: string, accesssoryType: string): boolean {
    this.assertUserIsSignedIn();
    return true;
  }

  // TODO: implement this
  gainExp(amount: number, folderName: string) {
    this.assertUserIsSignedIn();
  }
}