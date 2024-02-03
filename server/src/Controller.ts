import { User } from "./model/User";
import { Egg } from "./model/Egg";
import { Achievement } from "./model/Achievement";
import { Task } from "./model/Task";
import { TaskFolder } from "./model/TaskFolder";

import { DateTime } from "./types/DateTime";
import { Duration } from "./types/Duration";
import { UserID } from "./types/UserID";

export class Controller {
  currentUserID?: UserID;
  currentUser?: User;

  constructor() {

  }
}