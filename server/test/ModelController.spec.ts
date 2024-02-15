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


describe('addUnivCredits', function () {
  describe('0 → adds 0 creds && 1 → adds 1 creds && 10000 → adds 10000 creds', function () {
    it('should have correct num of univ credit', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      // 0 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        contr.addUnivCredits(0);
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
      // 1 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        contr.addUnivCredits(1);
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits + 1, userAfter.univCredits);
      }
      // 10000 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        contr.addUnivCredits(10000);
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits + 10000, userAfter.univCredits);
      }
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      // -1 case
      for (let i = 0; i < MAX_CASES; i++) {
        assert.throws(() => contr.addUnivCredits(-1), Error, 'Illegal operation: negative credit value');
      }
      // -10000 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        assert.throws(() => contr.addUnivCredits(-1), Error, 'Illegal operation: negative credit value');
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
    });
  });
});



describe('removeUnivCredits', function () {
  describe('0 → adds 0 creds && 1 → removes 1 creds && 10000 → removes 10000 creds', function () {
    it('should have correct num of univ credit', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      // 0 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        contr.removeUnivCredits(0);
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
      // 1 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        contr.removeUnivCredits(1);
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits - 1, userAfter.univCredits);
      }
      // 10000 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        contr.removeUnivCredits(10000);
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits - 10000, userAfter.univCredits);
      }
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      // -1 case
      for (let i = 0; i < MAX_CASES; i++) {
        assert.throws(() => contr.removeUnivCredits(-1), Error, 'Illegal operation: negative credit value');
      }
      // -10000 case
      for (let i = 0; i < MAX_CASES; i++) {
        let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
        assert.throws(() => contr.removeUnivCredits(-1), Error, 'Illegal operation: negative credit value');
        let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
    });
  });
});




describe('addEggCredits', function () {
  describe('0 → adds 0 creds && 1 → adds 1 creds && 10000 → adds 10000 creds', function () {
    it('should have correct num of univ credit', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      contr.addFolder(folderName, "desc", "eggType")
      function checker(num: number): void {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
          contr.addEggCredits(num, folderName);
          let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
          assert.strictEqual(folderBefore.eggCredits + num, folderAfter.eggCredits);
        }
      }
      // cases 0, 1, 10000
      checker(0);
      checker(1);
      checker(10000);
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      contr.addFolder(folderName, "desc", "eggType")
      function checker(num: number): void {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
          assert.throws(() => contr.addEggCredits(num, folderName), Error, 'Illegal operation: negative credit value');
          let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
          assert.strictEqual(folderBefore.eggCredits, folderAfter.eggCredits);
        }
      }
      // -1, 10000 cases
      checker(-1);
      checker(-10000);
    });
  });
});


describe('removeEggCredits', function () {
  describe('0 → adds 0 creds && 1 → removes 1 creds && 10000 → removes 10000 creds', function () {
    it('should have correct num of univ credit', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      contr.addFolder(folderName, "desc", "eggType")
      function checker(num: number): void {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
          contr.removeEggCredits(num, folderName);
          let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
          assert.strictEqual(folderBefore.eggCredits - num, folderAfter.eggCredits);
        }
      }
      // cases 0, 1, 10000
      checker(0);
      checker(1);
      checker(10000);
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      contr.addFolder(folderName, "desc", "eggType")
      function checker(num: number): void {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
          assert.throws(() => contr.removeEggCredits(num, folderName), Error, 'Illegal operation: negative credit value');
          let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
          assert.strictEqual(folderBefore.eggCredits, folderAfter.eggCredits);
        }
      }
      // -1, 10000 cases
      checker(-1);
      checker(-10000);
    });
  });
});




describe('buyAccessory', function () {
  /* for reference, types in EggManager are
  
      makeAccessory(name: string): Accessory {
        const acc: Accessory = {
          name: name,
          graphicLink: "",
          cost: 100,
        }
      }

      this.eggTypes.set("egg1", this.makeEggType("egg1"))
      this.eggTypes.set("egg2", this.makeEggType("egg2"))

      this.interactions.set("inter1", this.makeInteraction("inter1"))
      this.interactions.set("inter2", this.makeInteraction("inter2"))

      this.accessories.set("acc1", this.makeAccessory("acc1"))
      this.accessories.set("acc2", this.makeAccessory("acc2"))
    */
  describe('normal case →', function () {
    it('should have correct data shown for Acc && return true', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        contr.addUnivCredits(10000 * MAX_CASES);
        for (let i = 0; i < MAX_CASES; i++) {
          let ret = contr.buyAccessory(folderName, "acc1");
          let folder = user.getTaskFolders().get(folderName);
          assert(folder !== undefined);
          let accs = folder.getEgg().getEquippedAccessories();  // should have exactly one acc
          accs.forEach(function (accType) {
            const accessory = contr.getEggManager().getAccessory(accType);
            assert(accessory !== undefined);
            assert.strictEqual(accessory.cost, 100);
            assert.strictEqual(accessory.name, "acc1");
            assert.strictEqual(accessory.graphicLink, "");
          });
          folder.getEgg().getEquippedAccessories().clear();
          assert(ret);
        }
      }
    });
  });
  // 'you already purchased this accessory'

  describe('credit-check case when eggCredits >= cost', function () {
    it('should spends egg-specific credits + return true', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        let eggCredits = 10000 * MAX_CASES;
        contr.addEggCredits(eggCredits, folderName);
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          assert(contr.buyAccessory(folderName, "acc1"));
          eggCredits -= 100;  // default accesory cost
          assert.strictEqual(eggCredits, folder.getEggCredits());
          folder.getEgg().getEquippedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when eggCredits < cost but can still afford', function () {
    it('should return true && eggCredits == 0 && univCredits -= (cost - eggCredits)', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        let univCredits = MAX_CASES * 100;
        contr.addUnivCredits(univCredits);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          contr.addEggCredits(eggCredits, folderName);  // varying egg credits
          assert(contr.buyAccessory(folderName, "acc1"));
          univCredits -= (100 - eggCredits);
          assert.strictEqual(0, folder.getEggCredits());
          assert.strictEqual(univCredits, user.getUnivCredits());
          folder.getEgg().getEquippedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when there are not enough credits', function () {
    it('should return false and spend no credits', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          contr.addEggCredits(eggCredits, folderName);  // varying egg credits
          assert(!contr.buyAccessory(folderName, "acc1"));  // assert we cannot buy
          assert.strictEqual(eggCredits, folder.getEggCredits());
          contr.removeEggCredits(eggCredits, folderName);
        }
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      contr.addFolder(folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.buyAccessory(folderName + i, "acc1"), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('accessory/inter not allowed → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let folderName = "name ";
      contr.addFolder(folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.buyAccessory(folderName, "fakeAcc" + i), Error,
                      'not allowed to buy this accessory');
      }
    });
  });
});




describe('buyInteraction', function () {
  /* for reference, types in EggManager are
  
      makeInteraction(name: string): Interaction {
        const inter: Interaction = {
          name: name,
          cost: 100,
          expGained: 100,
        }
        return inter;
      }

      this.eggTypes.set("egg1", this.makeEggType("egg1"))
      this.eggTypes.set("egg2", this.makeEggType("egg2"))

      this.interactions.set("inter1", this.makeInteraction("inter1"))
      this.interactions.set("inter2", this.makeInteraction("inter2"))

      this.accessories.set("acc1", this.makeAccessory("acc1"))
      this.accessories.set("acc2", this.makeAccessory("acc2"))
    */
  describe('normal case →', function () {
    it('should have exp is correctly gained && return true', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        contr.addUnivCredits(10000 * MAX_CASES);
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        let exp = folder.getEgg().getExp();
        for (let i = 0; i < MAX_CASES; i++) {
          assert(contr.buyInteraction(folderName, "inter1"));
          exp += 100;  // default exp value
          assert.strictEqual(exp, folder.getEgg().getExp());
        }
      }
    });
  });
  // 'you already purchased this accessory'

  describe('credit-check case when eggCredits >= cost', function () {
    it('should spends egg-specific credits + return true', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        let eggCredits = 10000 * MAX_CASES;
        contr.addEggCredits(eggCredits, folderName);
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          assert(contr.buyInteraction(folderName, "inter1"));
          eggCredits -= 100;  // default accesory cost
          assert.strictEqual(eggCredits, folder.getEggCredits());
          folder.getEgg().getEquippedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when eggCredits < cost but can still afford', function () {
    it('should return true && eggCredits == 0 && univCredits -= (cost - eggCredits)', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        let univCredits = MAX_CASES * 100;
        contr.addUnivCredits(univCredits);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          contr.addEggCredits(eggCredits, folderName);  // varying egg credits
          assert(contr.buyInteraction(folderName, "inter1"));
          univCredits -= (100 - eggCredits);
          assert.strictEqual(0, folder.getEggCredits());
          assert.strictEqual(univCredits, user.getUnivCredits());
          folder.getEgg().getEquippedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when there are not enough credits', function () {
    it('should return false and spend no credits', function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        contr.addFolder(folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          contr.addEggCredits(eggCredits, folderName);  // varying egg credits
          assert(!contr.buyInteraction(folderName, "inter1"));  // assert we cannot buy
          assert.strictEqual(eggCredits, folder.getEggCredits());
          contr.removeEggCredits(eggCredits, folderName);
        }
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      contr.addFolder(folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.buyInteraction(folderName + i, "inter1"), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('accessory/inter not allowed → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let folderName = "name ";
      contr.addFolder(folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.buyInteraction(folderName, "fakeInter" + i), Error,
                      'not allowed to buy this interaction');
      }
    });
  });
});



describe('gainExp', function () {
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', function () {
      let contr = getContr();
      getDefaultUser(contr);
      let folderName = "name ";
      contr.addFolder(folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.throws(() => contr.gainExp(1000, folderName + i), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('0 → adds 0 creds && 1 → adds 1 creds && 100 → adds 100 creds', function () {
    // for reference, in EggManager; stages 1-5 are:
    //    let bounds = [100, 200, 300, 400, 500];
    it('should gain correct exp and correctly evolve (right stage)', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      contr.addFolder(folderName, "desc", "egg1")
      let folder = user.getTaskFolders().get(folderName);
      assert(folder !== undefined);
      let maxLevels = 5;
      function checker(num: number, checkLevels: boolean, offByOne: boolean = false): void {
        let exp = 0;
        let firstTime = true;
        if (offByOne) {
          num -= 1;
        }
        for (let i = 0; i < maxLevels; i++) {
          // exp check
          contr.gainExp(num, folderName);
          exp += num;
          if (firstTime && offByOne) {
            num += 1;
            firstTime = false;  // want to add 99, then 100, then 100...exp
          }
          assert(folder !== undefined);
          // console.log("expected exp: " + exp);
          // console.log("actual exp: " + folder.getEgg().getExp());
          assert.strictEqual(exp, folder.getEgg().getExp());

          // stage check (can only be done if no DB is used)
          if (checkLevels && !contr.getEggManager().USE_DB) {
            let correctStage = i + 1;
            if (offByOne) {
              correctStage = i;
            }
            // console.log("expected stage: " + correctStage);
            // console.log("actual stage: " + folder.getEgg().getEggStage());
            assert.strictEqual(correctStage, folder.getEgg().getEggStage());
            if (i === maxLevels - 1) {
              checkLevels = false;
            }
          }
        }
        assert(folder !== undefined);
        folder.getEgg().setExp(0);        // to reset data
        folder.getEgg().setEggStage(0);   // to reset data
      }
      // cases 0, 1, 100
      checker(0, false);
      checker(1, false);
      checker(100, true);
      checker(100, true, true);  // off-by-one case
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && egg stays the same', function () {
      let contr = getContr();
      let user = getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      contr.addFolder(folderName, "desc", "eggType")
      function checker(num: number): void {
        for (let i = 0; i < MAX_CASES; i++) {
          let eggBefore = viewer.getEggInfo(user.getID(), folderName);
          assert.throws(() => contr.gainExp(num, folderName), Error, 'Illegal operation: negative credit value');
          let eggAfter = viewer.getEggInfo(user.getID(), folderName);
  
          assert.strictEqual(eggBefore, eggAfter);
        }
      }
      // -1, 10000 cases
      checker(-1);
      checker(-10000);
    });
  });
});