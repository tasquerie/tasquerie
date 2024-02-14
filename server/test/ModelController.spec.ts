// Unit tests for ModelController

import { strict as assert } from 'assert';
import { IDManager } from '../src/model/IDManager';
import { UserManager } from '../src/model/UserManager';
import { EggManager } from '../src/model/EggManager';
import { ModelController } from '../src/ModelController';
import { WriteManager } from '../src/model/WriteManager';
import { ModelView } from '../src/ModelView';
import { TaskFolder } from '../src/model/TaskFolder';
import { User } from '../src/model/User';
import { Task } from '../src/model/Task';
import { TaskID } from '../src/types/TaskID';

const MAX_CASES = 1000;
const MAX_PASS_LEN = 8;

////       LOGIN METHODS         ////

function getContr(): ModelController {
  let idMan = new IDManager();
  let userMan = new UserManager(idMan);
  let eggMan = new EggManager();
  let writeMan = new WriteManager();
  return new ModelController(userMan, idMan, eggMan, writeMan);
}
function getDefaultUser(contr: ModelController): User {
  let username = "username";
  let password = "password";
  contr.signup(username, password);  // already logged in
  let user = contr.getCurrentUser();
  assert(user !== undefined);
  return user;
}
function getViewer(contr: ModelController): ModelView {
  return new ModelView(contr.getIDManager(), contr.getEggManager());
}

describe('login', function () {
  describe('correct login info → return true', function () {
    it('should return true', function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        contr.signup(username, password);
        assert(contr.login(username, password));
      }
    });
  });
  describe('bad username → returns false + not logged in', function () {
    it('should return false and check user is not logged in', function () {
      let contr = getContr();
      let username = "user ";
      let password = "password ";
      contr.signup(username, password);
      contr.logout();
      for (let i = 0; i < MAX_CASES; i++) {
        assert(!contr.login(username + i, password));
        assert(!contr.isLoggedIn());
      }
    });
  });
  describe('bad password → returns false + not logged in', function () {
    it('should return false and check user is not logged in', function () {
      let contr = getContr();
      let username = "user ";
      let password = "password ";
      contr.signup(username, password);
      contr.logout();
      for (let i = 0; i < MAX_CASES; i++) {
        assert(!contr.login(username, password + i));
        assert(!contr.isLoggedIn());
      }
    });
  });
  describe('correct login, bad user, bad password interlaced', function () {
    it('should return true for good login, false for bad', function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        contr.signup(username, password);
        assert(contr.login(username, password));
        assert(!contr.login(username + "k", password));
        assert(!contr.login(username, password + "k"));
        assert(!contr.login(username + "k", password + "k"));
      }
    });
  });
});



describe('login', function () {
  describe('logged in → logged out && logged out → still logged out', function () {
    it('should be logged out', function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        contr.signup(username, password);
        assert(contr.login(username, password));
        assert(contr.isLoggedIn());
        contr.logout();
        assert(!contr.isLoggedIn());
        contr.logout();
        assert(!contr.isLoggedIn());
      }
    });
  });
});



describe('signup', function () {
  describe('normal correct case →', function () {
    it('is logged in + can login with username and password after signup and logging out', function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        contr.signup(username, password);
        assert(contr.isLoggedIn());
        contr.logout();
        assert(contr.login(username, password));
      }
    });
  });
  describe('username already exists → throw exc', function () {
    it('should throw an error', function () {
      let contr = getContr();
      let username = "user";
      let password = "password";
      contr.signup(username, password);
      for (let i = 0; i < MAX_CASES; i++) {
        password = "password " + i;
        assert.throws(() => contr.signup(username, password), Error, 'Username already exists!');
      }
    });
  });
  describe('password < 8 chars → throw exc', function () {
    it('should throw an error', function () {
      let contr = getContr();
      let password = ""
      for (let i = 0; i < MAX_PASS_LEN; i++) {
        let username = "user " + i;
        assert.throws(() => contr.signup(username, password), Error, 'Password must be at least 8 characters long.');
        password += "a";
      }
      // NOW PASSWORD IS LENGTH 8 --> SHOULD WORK
      for (let i = 0; i < MAX_PASS_LEN; i++) {
        let username = "user " + i;
        assert.doesNotThrow(() => contr.signup(username, password));
        password += "a";
      }
    });
  });
});


////       FUNCTIONAL METHODS         ////
describe('addFolder', function () {
  describe('normal correct case → correct folder data', function () {
    it('should have correct folder data', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      for (let i = 0; i < MAX_CASES; i++) {
        let folderName = "name " + i;
        let folder = new TaskFolder(folderName, "desc " + i, "eggType " + i)
        contr.addFolder(folder.getName(), folder.getDescription(), folder.getEgg().getEggType());

        // test here
        let expected = folder.getJSON();
        let actual = viewer.getTaskFolderInfo(user.getID(), folderName);
        // console.log(actual);  // to see what data looks like
        assert.strictEqual(expected, actual);
      }
    });
  });
  describe('folder already exists → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      let desc = "desc ";
      let eggType = "eggType ";
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.doesNotThrow(() => contr.addFolder(folderName + i, desc + i, eggType + i));
        assert.throws(() => contr.addFolder(folderName + i, desc + i, eggType + i), Error,
                      'Duplicated value: the given folder name already exists');
      }
    });
  });
});


describe('setFolder', function () {
  describe('normal correct case → correct folder data', function () {
    it('should have correct folder data && optional params undefined → same data', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name ";
      let desc = "desc ";
      let eggType = "eggType ";
      for (let i = 0; i < MAX_CASES; i++) {
        contr.addFolder(folderName + i, desc, eggType);

                
        let before = viewer.getTaskFolderInfo(user.getID(), folderName + i);
        contr.setFolder(folderName + i);
        let after = viewer.getTaskFolderInfo(user.getID(), folderName + i);
        assert.strictEqual(before, after);

        contr.setFolder(folderName + i, folderName + i + "k", desc + i);

        let folder = new TaskFolder(folderName + i + "k", desc + i, eggType);
        // test here
        let expected = folder.getJSON();
        let actual = viewer.getTaskFolderInfo(user.getID(), folderName + i + "k");
        // console.log(actual);  // to see what data looks like
        assert.strictEqual(expected, actual);
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      let desc = "desc ";
      let eggType = "eggType ";
      contr.addFolder(folderName, desc, eggType);
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.setFolder(folderName + i, folderName + i + "k", desc), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('newName already exists —> exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      contr.addFolder("already exist", "desc", "eggType");
      let folderName = "name ";
      for (let i = 0; i < MAX_CASES; i++) {
        // add folders so they can be set
        contr.addFolder(folderName + i, "desc", "eggType");
      }
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.setFolder(folderName + i, "already exist", "desc"), Error,
                      'Duplicated value: the new folder name already exists');
      }
    });
  });
});


describe('deleteFolder', function () {
  describe('folder is correctly missing', function () {
    it('should have correct folder data', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      for (let i = 0; i < MAX_CASES; i++) {
        let folderName = "name " + i;
        let folder = new TaskFolder(folderName, "desc " + i, "eggType " + i)
        contr.addFolder(folder.getName(), folder.getDescription(), folder.getEgg().getEggType());
        let actualBeforeDelete = viewer.getTaskFolderInfo(user.getID(), folderName);
        contr.deleteFolder(folder.getName());

        // test here
        let actual = viewer.getTaskFolderInfo(user.getID(), folderName);
        // console.log(actual);  // to see what data looks like
        assert.strictEqual(folder.getJSON(), actualBeforeDelete);
        assert.strictEqual("", actual);
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.deleteFolder(folderName + i), Error,
                      'The folder name does not exist');
      }
    });
  });
});


describe('addTask', function () {
  describe('normal correct case → correct task data', function () {
    it('should have correct task data', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "folderName";
      contr.addFolder(folderName, "desc", "eggType");
      for (let i = 0; i < MAX_CASES; i++) {
        let taskID = contr.addTask(folderName, "task name " + i, "desc " + i, [], []);
        let expectedTask = new Task(contr.getIDManager(), "task name " + i, "desc " + i, [], user.getID(), []);

        // test here
        let actualTask = JSON.parse(viewer.getTaskInfo(taskID));
        assert.strictEqual(expectedTask.getName(), actualTask.name);
        assert.strictEqual(expectedTask.getDescription(), actualTask.description);
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.addTask(folderName + i, "task name " + i, "desc " + i, [], []), Error,
                      'The folder name does not exist');
      }
    });
  });
});


describe('setTask', function () {
  describe('normal correct case → correct task data', function () {
    it('should have correct task data', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "folderName";
      contr.addFolder(folderName, "desc", "eggType");
      for (let i = 0; i < MAX_CASES; i++) {
        let taskID = contr.addTask(folderName,            "task name " + i,       "desc " + i, [], []);
        contr.setTask(folderName, taskID, false,          "task name " + i + "k", "desc " + i + "k");
        let expectedTask = new Task(contr.getIDManager(), "task name " + i + "k", "desc " + i + "k", [], user.getID(), []);

        // test here
        let actualTask = JSON.parse(viewer.getTaskInfo(taskID));
        assert.strictEqual(expectedTask.getName(), actualTask.name);
        assert.strictEqual(expectedTask.getDescription(), actualTask.description);
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      contr.addFolder(folderName, "desc", "eggType");
      let taskID = contr.addTask(folderName, "task name", "desc", [], []);
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.setTask(folderName + i, taskID, false, "task name", "desc", [], []), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('taskID DNE IN FOLDER (not in general) —> exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let folderAAA = "folder AAA";
      contr.addFolder(folderAAA, "desc", "eggType");
      let taskIDs: Set<TaskID> = new Set<TaskID>();
      for (let i = 0; i < MAX_CASES; i++) {
        taskIDs.add(contr.addTask(folderAAA, "task name " + i, "desc " + i, [], []));
      }
      let folderBBB = "folder BBB";
      contr.addFolder(folderBBB, "desc", "eggType");
      taskIDs.forEach(taskID => {
        // test here
        assert.throws(() => contr.setTask(folderBBB, taskID, false, "task name", "desc", [], []), Error,
                      'The taskID does not exist in this folder');
      });
    });
  });
});



describe('deleteTask', function () {
  describe('normal correct case → task is gone from folder and view', function () {
    it('should have task gone from folder and view', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "folderName";
      contr.addFolder(folderName, "desc", "eggType");
      for (let i = 0; i < MAX_CASES; i++) {
        let taskID = contr.addTask(folderName, "task name " + i, "desc " + i, [], []);
        contr.deleteTask(folderName, taskID);
        let expected = "";

        // test here -- deleted from view
        let actual = viewer.getTaskInfo(taskID);
        assert.strictEqual(expected, actual);

        // deleted from folder
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        assert(folder.getTasks().get(taskID) === undefined)
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      contr.addFolder(folderName, "desc", "eggType");
      let taskID = contr.addTask(folderName, "task name", "desc", [], []);
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.deleteTask(folderName + i, taskID), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('taskID DNE IN FOLDER (not in general) —> exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let folderAAA = "folder AAA";
      contr.addFolder(folderAAA, "desc", "eggType");
      let taskIDs: Set<TaskID> = new Set<TaskID>();
      for (let i = 0; i < MAX_CASES; i++) {
        taskIDs.add(contr.addTask(folderAAA, "task name " + i, "desc " + i, [], []));
      }
      let folderBBB = "folder BBB";
      contr.addFolder(folderBBB, "desc", "eggType");
      taskIDs.forEach(taskID => {
        // test here
        assert.throws(() => contr.deleteTask(folderBBB, taskID), Error,
                      'The taskID does not exist in this folder');
      });
    });
  });
});