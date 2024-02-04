import { TaskFolder } from "./model/TaskFolder";
import { TaskID } from "./types/TaskID";
import { UserID } from "./types/UserID";

export class ModelView {
  // TODO: implement this (please call exising getJSON func in the class!!)
  getUserInfo(id: UserID): string {
    return "";
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  getTaskInfo(id: TaskID): string {
    return "";
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  getTaskFolderInfo(id: UserID, folderName: string): string {
    return "";
  }

  // TODO: implement this (please call exising getJSON func in the class!!)
  getEggInfo(id: UserID, folderName: string): string {
    return "";
  }
}