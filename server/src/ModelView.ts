import { TaskFolder } from "./model/TaskFolder";
import { TaskID } from "./types/TaskID";
import { UserID } from "./types/UserID";

export class ModelView {
  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  getUserInfo(id: UserID): string {
    return "";
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  getTaskInfo(id: TaskID): string {
    return "";
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  getTaskFolderInfo(id: UserID, folderName: string): string {
    return "";
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  // TODO: test me
  getEggInfo(id: UserID, folderName: string): string {
    return "";
  }
}