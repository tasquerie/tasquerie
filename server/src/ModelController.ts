import { Egg } from "./model/Egg";
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
  // TODO: test me
  login(username: string, password: string): boolean {
    return true;
  }

  // TODO: implement this (may need DB call?)
  // TODO: test me
  logout(): void {
    this.currentUserID = undefined;
    this.currentUser = undefined;
  }

  // TODO: implement this
  // TODO: test me
  signup(username: string, password: string): void {
    
  }

  // If user is not signed-in, throws an Error.
  private assertUserIsSignedIn(): void {
    if (this.currentUserID === undefined || this.currentUser === undefined) {
      throw new Error('Illegal operation: user is not signed-in!');
    }
  }


  // data manipulation methods
  // TODO: implement this
  // TODO: test me
  addFolder(name: string, description: string, egg: Egg): void {
    this.assertUserIsSignedIn();

    // reference to the taskfolder of the current user.
    // CHECK:
    // ? means that currentUser can be undefined but it is checked in this.assertUserIsSignedIn method...
    // is it safe to erase it?
    const taskFolderMap:Map<string, TaskFolder> | undefined = this.currentUser?.getTaskFolders();

    if (taskFolderMap === undefined) {
      throw new Error('NoSuchElement: the taskfolder of the user is not defined');
    } else if (taskFolderMap.has(name)) {
      throw new Error('Duplicated value: the given name already exists');
    }

    const eggType = egg.getEggType();
    const newFolder = new TaskFolder(name, description, eggType);
    taskFolderMap.set(name, newFolder);
  }

  // TODO: implement this
  // TODO: test me
  setFolder(name: string, newName?: string, description?: string): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  // TODO: test me
  deleteFolder(name: string): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  // TODO: test me
  addTask(folderName: string, taskName: string, description: string, tags: string[],
          whoSharedWith: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  // TODO: test me
  setTask(id: TaskID, isComplete?: boolean, taskName?: string,
          description?: string, tags?: string[], whoSharedWith?: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  // TODO: test me
  deleteTask(id: TaskID): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  // TODO: test me
  addUnivCredits(amount: number): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {

    }
  }

  // TODO: implement this
  // TODO: test me
  removeUnivCredits(amount: number): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {
      
    }
  }

  // TODO: implement this
  // TODO: test me
  addEggCredits(amount: number, folderName: string): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {

    }
  }

  // TODO: implement this
  // TODO: test me
  removeEggCredits(amount: number, folderName: string): void {
    this.assertUserIsSignedIn();
    if (amount > 0) {
      
    }
  }

  // TODO: implement this
  // TODO: test me
  buyAccessory(folderName: string, accesssoryType: string): boolean {
    this.assertUserIsSignedIn();
    return true;
  }

  // TODO: implement this
  // TODO: test me
  gainExp(amount: number, folderName: string) {
    this.assertUserIsSignedIn();
  }
}