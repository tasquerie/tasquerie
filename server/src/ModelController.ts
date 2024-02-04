import { Egg } from "./model/Egg";
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
    return true;
  }

  // TODO: implement this (may need DB call?)
  logout(): void {
    this.currentUserID = undefined;
    this.currentUser = undefined;
  }

  // TODO: implement this
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
  addFolder(name: string, description: string, egg: Egg): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  setFolder(name: string, newName?: string, description?: string): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  deleteFolder(name: string): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  addTask(folderName: string, taskName: string, description: string, tags: string[],
          whoSharedWith: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  setTask(id: TaskID, isComplete?: boolean, taskName?: string,
          description?: string, tags?: string[], whoSharedWith?: UserID[],
          startDate?: DateTime, cycleDuration?: Duration, deadline?: DateTime): void {
    this.assertUserIsSignedIn();
  }

  // TODO: implement this
  deleteTask(id: TaskID): void {
    this.assertUserIsSignedIn();
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