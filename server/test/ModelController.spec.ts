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

// for testing
const TEMP_ID_TASK: TaskID = {
  id: "NULL"
};

////       LOGIN METHODS         ////

function getContr(): ModelController {
  let idMan = new IDManager();
  let userMan = new UserManager(idMan);
  let eggMan = new EggManager();
  let writeMan = new WriteManager();
  return new ModelController(userMan, idMan, eggMan, writeMan);
}
async function getDefaultUser(contr: ModelController): Promise<User> {
  let username = "username";
  let password = "password";
  await contr.signup(username, password);  // already logged in
  // debug
  // console.log("DEBUG LOGIN: " + contr.login(username, password))
  let user = contr.getCurrentUser();
  assert(user !== undefined);
  return user;
}
function getViewer(contr: ModelController): ModelView {
  return new ModelView(contr.getIDManager(), contr.getEggManager());
}

describe('login', function () {
  describe('correct login info → return true', function () {
    it('should return true', async function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        await contr.signup(username, password);
        assert(contr.login(username, password));
      }
    });
  });
  describe('bad username → returns false + not logged in', function () {
    it('should return false and check user is not logged in', async function () {
      let contr = getContr();
      let username = "user ";
      let password = "password ";
      await contr.signup(username, password);
      contr.logout();
      for (let i = 0; i < MAX_CASES; i++) {
        assert(!contr.login(username + i, password));
        assert(!contr.isLoggedIn());
      }
    });
  });
  describe('bad password → returns false + not logged in', function () {
    it('should return false and check user is not logged in', async function () {
      let contr = getContr();
      let username = "user ";
      let password = "password ";
      await contr.signup(username, password);
      contr.logout();
      for (let i = 0; i < MAX_CASES; i++) {
        assert(!contr.login(username, password + i));
        assert(!contr.isLoggedIn());
      }
    });
  });
  describe('correct login, bad user, bad password interlaced', function () {
    it('should return true for good login, false for bad', async function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        await contr.signup(username, password);
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
    it('should be logged out', async function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        await contr.signup(username, password);
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
    it('is logged in + can login with username and password after signup and logging out', async function () {
      let contr = getContr();
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        await contr.signup(username, password);
        assert(contr.isLoggedIn());
        contr.logout();
        assert(contr.login(username, password));
      }
    });
  });
  describe('username already exists → throw exc', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let username = "user";
      let password = "password";
      await contr.signup(username, password);
      for (let i = 0; i < MAX_CASES; i++) {
        password = "password " + i;
        assert.rejects(async () => await contr.signup(username, password), Error, 'Username already exists!');
        // expect(contr.signup(username, password)).to.be.throw('Username already exists!');
      }
    });
  });
  describe('password < 8 chars → throw exc', function () {
    it('should throw an error', function () {
      let contr = getContr();
      let password = ""
      for (let i = 0; i < MAX_PASS_LEN; i++) {
        let username = "user " + i;
        assert.rejects(async () => await contr.signup(username, password), Error, 'Password must be at least 8 characters long.');
        password += "a";
      }
      // NOW PASSWORD IS LENGTH 8 --> SHOULD WORK
      for (let i = 0; i < MAX_PASS_LEN; i++) {
        let username = "user " + i;
        assert.doesNotThrow(async () => await contr.signup(username, password));
        password += "a";
      }
    });
  });
});


////       FUNCTIONAL METHODS         ////
describe('addFolder', function () {
  describe('normal correct case → correct folder data', function () {
    it('should have correct folder data', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      for (let i = 0; i < MAX_CASES; i++) {
        let folderName = "name " + i;
        let folder = new TaskFolder(folderName, "desc " + i, "eggType " + i)
        await contr.addFolder(user.getID(), folder.getName(), folder.getDescription(), folder.getEgg().getEggType());

        // test here
        let expected = folder.getJSON();
        let actual = await viewer.getTaskFolderInfo(user.getID(), folderName);
        // console.log(actual);  // to see what data looks like
        // debug to verify data
        // console.log(user.getJSON());
        assert.strictEqual(expected, actual);
      }
    });
  });
  describe('folder already exists → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      let desc = "desc ";
      let eggType = "eggType ";
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.doesNotThrow(async () => await contr.addFolder(user.getID(), folderName + i, desc + i, eggType + i));
        assert.rejects(async () => await contr.addFolder(user.getID(), folderName + i, desc + i, eggType + i), Error,
                      'Duplicated value: the given folder name already exists');
      }
    });
  });
});


describe('setFolder', function () {
  describe('normal correct case → correct folder data', function () {
    it('should have correct folder data && optional params undefined → same data', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name ";
      let desc = "desc ";
      let eggType = "eggType ";
      for (let i = 0; i < MAX_CASES; i++) {
        contr.addFolder(user.getID(), folderName + i, desc, eggType);

                
        let before = await viewer.getTaskFolderInfo(user.getID(), folderName + i);
        await contr.setFolder(user.getID(), folderName + i);
        let after = await viewer.getTaskFolderInfo(user.getID(), folderName + i);
        assert.strictEqual(before, after);

        await contr.setFolder(user.getID(), folderName + i, folderName + i + "k", desc + i);

        let folder = new TaskFolder(folderName + i + "k", desc + i, eggType);
        // test here
        let expected = folder.getJSON();
        let actual = await viewer.getTaskFolderInfo(user.getID(), folderName + i + "k");
        // console.log(actual);  // to see what data looks like
        assert.strictEqual(expected, actual);
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      let desc = "desc ";
      let eggType = "eggType ";
      await contr.addFolder(user.getID(), folderName, desc, eggType);
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.setFolder(user.getID(), folderName + i, folderName + i + "k", desc), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('newName already exists —> exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      await contr.addFolder(user.getID(), "already exist", "desc", "eggType");
      let folderName = "name ";
      for (let i = 0; i < MAX_CASES; i++) {
        // add folders so they can be set
        await contr.addFolder(user.getID(), folderName + i, "desc", "eggType");
      }
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.setFolder(user.getID(), folderName + i, "already exist", "desc"), Error,
                      'Duplicated value: the new folder name already exists');
      }
    });
  });
});


describe('deleteFolder', function () {
  describe('folder is correctly missing', function () {
    it('should have correct folder data', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      for (let i = 0; i < MAX_CASES; i++) {
        let folderName = "name " + i;
        let folder = new TaskFolder(folderName, "desc " + i, "eggType " + i)
        await contr.addFolder(user.getID(), folder.getName(), folder.getDescription(), folder.getEgg().getEggType());
        let actualBeforeDelete = await viewer.getTaskFolderInfo(user.getID(), folderName);
        await contr.deleteFolder(user.getID(), folder.getName());

        // test here
        let actual = await viewer.getTaskFolderInfo(user.getID(), folderName);
        // console.log(actual);  // to see what data looks like
        assert.strictEqual(folder.getJSON(), actualBeforeDelete);
        assert.strictEqual("", actual);
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.deleteFolder(user.getID(), folderName + i), Error,
                      'The folder name does not exist');
      }
    });
  });
});


describe('addTask', function () {
  describe('normal correct case → correct task data', function () {
    it('should have correct task data', async function () {
      let contr = getContr();
<<<<<<< HEAD
      let user = getDefaultUser(contr);
      const userID = user.getID();
=======
      let user = await getDefaultUser(contr);
>>>>>>> origin/main
      let viewer = getViewer(contr);
      let folderName = "folderName";
      await contr.addFolder(user.getID(), folderName, "desc", "eggType");
      for (let i = 0; i < MAX_CASES; i++) {
        let taskID = await contr.addTask(user.getID(), folderName, "task name " + i, "desc " + i, [], []);
        let expectedTask = new Task(TEMP_ID_TASK, "task name " + i, "desc " + i, [], user.getID(), []);
        expectedTask.setID(contr.getIDManager().nextTaskID(expectedTask));

        // test here
<<<<<<< HEAD
        //Check: if this works
        const taskInfoStr = await viewer.getTaskInfo(userID, taskID);
        let actualTask = JSON.parse(taskInfoStr);

=======
        let actualTask = JSON.parse(await viewer.getTaskInfo(user.getID(), taskID));
>>>>>>> origin/main
        assert.strictEqual(expectedTask.getName(), actualTask.name);
        assert.strictEqual(expectedTask.getDescription(), actualTask.description);
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.addTask(user.getID(), folderName + i, "task name " + i, "desc " + i, [], []), Error,
                      'The folder name does not exist');
      }
    });
  });
});


describe('setTask', function () {
  describe('normal correct case → correct task data', function () {
    it('should have correct task data', async function () {
      let contr = getContr();
<<<<<<< HEAD
      let user = getDefaultUser(contr);
      const userID = user.getID();
=======
      let user = await getDefaultUser(contr);
>>>>>>> origin/main
      let viewer = getViewer(contr);
      let folderName = "folderName";
      await contr.addFolder(user.getID(), folderName, "desc", "eggType");
      for (let i = 0; i < MAX_CASES; i++) {
        let taskID = await contr.addTask(user.getID(), folderName,      "task name " + i,       "desc " + i, [], []);
        await contr.setTask(user.getID(), taskID, false,          "task name " + i + "k", "desc " + i + "k");
        let expectedTask = new Task(TEMP_ID_TASK, "task name " + i + "k", "desc " + i + "k", [], user.getID(), []);
        expectedTask.setID(contr.getIDManager().nextTaskID(expectedTask));

        // debug to verify data
        // console.log(user.getTaskFolders().get(folderName)?.getJSON());

        // test here
<<<<<<< HEAD
        // Check: if this works
        const taskInfoStr = await viewer.getTaskInfo(userID, taskID)
        let actualTask = JSON.parse(taskInfoStr);

=======
        let actualTask = JSON.parse(await viewer.getTaskInfo(user.getID(), taskID));
>>>>>>> origin/main
        assert.strictEqual(expectedTask.getName(), actualTask.name);
        assert.strictEqual(expectedTask.getDescription(), actualTask.description);
      }
    });
  });
  // describe('folder DNE (does not exist) → exception', function () {
  //   it('should throw an error', async function () {
  //     let contr = getContr();
  //     let user = await getDefaultUser(contr);
  //     let folderName = "name ";
  //     await contr.addFolder(user.getID(), folderName, "desc", "eggType");
  //     let taskID = await contr.addTask(user.getID(), folderName, "task name", "desc", [], []);
  //     for (let i = 0; i < MAX_CASES; i++) {
  //       // test here
  //       assert.rejects(async () => await contr.setTask(user.getID(), folderName + i, taskID, false, "task name", "desc", [], []), Error,
  //                     'The folder name does not exist');
  //     }
  //   });
  // });
  // describe('taskID DNE IN FOLDER (not in general) —> exception', function () {
  //   it('should throw an error', async function () {
  //     let contr = getContr();
  //     let user = await getDefaultUser(contr);
  //     let folderAAA = "folder AAA";
  //     await contr.addFolder(user.getID(), folderAAA, "desc", "eggType");
  //     let taskIDs: Set<TaskID> = new Set<TaskID>();
  //     for (let i = 0; i < MAX_CASES; i++) {
  //       taskIDs.add(await contr.addTask(user.getID(), folderAAA, "task name " + i, "desc " + i, [], []));
  //     }
  //     let folderBBB = "folder BBB";
  //     await contr.addFolder(user.getID(), folderBBB, "desc", "eggType");
  //     taskIDs.forEach(taskID => {
  //       // test here
  //       assert.rejects(async () => await contr.setTask(user.getID(), folderBBB, taskID, false, "task name", "desc", [], []), Error,
  //                     'The taskID does not exist in this folder');
  //     });
  //   });
  // });
});



describe('deleteTask', function () {
  describe('normal correct case → task is gone from folder and view', function () {
    it('should have task gone from folder and view', async function () {
      let contr = getContr();
<<<<<<< HEAD
      let user = getDefaultUser(contr);
      const userID = user.getID();
=======
      let user = await getDefaultUser(contr);
>>>>>>> origin/main
      let viewer = getViewer(contr);
      let folderName = "folderName";
      await contr.addFolder(user.getID(), folderName, "desc", "eggType");
      for (let i = 0; i < MAX_CASES; i++) {
        let taskID = await contr.addTask(user.getID(), folderName, "task name " + i, "desc " + i, [], []);
        await contr.deleteTask(user.getID(), folderName, taskID);
        let expected = "";

        // test here -- deleted from view
<<<<<<< HEAD
        // Check: if this await works
        let actual = await viewer.getTaskInfo(userID, taskID);
=======
        let actual = await viewer.getTaskInfo(user.getID(), taskID);
>>>>>>> origin/main
        assert.strictEqual(expected, actual);

        // deleted from folder
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        assert(folder.getTasks().get(taskID) === undefined)
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      await contr.addFolder(user.getID(), folderName, "desc", "eggType");
      let taskID = await contr.addTask(user.getID(), folderName, "task name", "desc", [], []);
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.deleteTask(user.getID(), folderName + i, taskID), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('taskID DNE IN FOLDER (not in general) —> exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderAAA = "folder AAA";
      await contr.addFolder(user.getID(), folderAAA, "desc", "eggType");
      let taskIDs: Set<TaskID> = new Set<TaskID>();
      for (let i = 0; i < MAX_CASES; i++) {
        taskIDs.add(await contr.addTask(user.getID(), folderAAA, "task name " + i, "desc " + i, [], []));
      }
      let folderBBB = "folder BBB";
      await contr.addFolder(user.getID(), folderBBB, "desc", "eggType");
      taskIDs.forEach(taskID => {
        // test here
        assert.rejects(async () => await contr.deleteTask(user.getID(), folderBBB, taskID), Error,
                      'The taskID does not exist in this folder');
      });
    });
  });
});


describe('addUnivCredits', function () {
  describe('0 → adds 0 creds && 1 → adds 1 creds && 10000 → adds 10000 creds', function () {
    it('should have correct num of univ credit', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      // 0 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        contr.addUnivCredits(0);
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        await contr.addUnivCredits(user.getID(), 0);
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
      // 1 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        contr.addUnivCredits(1);
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        await contr.addUnivCredits(user.getID(), 1);
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits + 1, userAfter.univCredits);
      }
      // 10000 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        contr.addUnivCredits(10000);
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        await contr.addUnivCredits(user.getID(), 10000);
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits + 10000, userAfter.univCredits);
      }
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      // -1 case
      for (let i = 0; i < MAX_CASES; i++) {
        assert.rejects(async () => await contr.addUnivCredits(user.getID(), -1), Error, 'Illegal operation: negative credit value');
      }
      // -10000 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        assert.throws(() => contr.addUnivCredits(-1), Error, 'Illegal operation: negative credit value');
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        assert.rejects(async () => await contr.addUnivCredits(user.getID(), -1), Error, 'Illegal operation: negative credit value');
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
    });
  });
});



describe('removeUnivCredits', function () {
  describe('0 → adds 0 creds && 1 → removes 1 creds && 10000 → removes 10000 creds', function () {
    it('should have correct num of univ credit', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      // 0 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        contr.removeUnivCredits(0);
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        await contr.removeUnivCredits(user.getID(), 0);
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
      // 1 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        contr.removeUnivCredits(1);
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        await contr.removeUnivCredits(user.getID(), 1);
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits - 1, userAfter.univCredits);
      }
      // 10000 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        contr.removeUnivCredits(10000);
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        await contr.removeUnivCredits(user.getID(), 10000);
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits - 10000, userAfter.univCredits);
      }
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      // -1 case
      for (let i = 0; i < MAX_CASES; i++) {
        assert.rejects(async () => await contr.removeUnivCredits(user.getID(), -1), Error, 'Illegal operation: negative credit value');
      }
      // -10000 case
      //CHECK: userInfoStr
      for (let i = 0; i < MAX_CASES; i++) {
<<<<<<< HEAD
        let userInfoStr = await viewer.getUserInfo(user.getID());
        let userBefore = JSON.parse(userInfoStr);
        assert.throws(() => contr.removeUnivCredits(-1), Error, 'Illegal operation: negative credit value');
        userInfoStr = await viewer.getUserInfo(user.getID());
        let userAfter = JSON.parse(userInfoStr);
=======
        let userBefore = JSON.parse(await viewer.getUserInfo(user.getID()));
        assert.rejects(async () => await contr.removeUnivCredits(user.getID(), -1), Error, 'Illegal operation: negative credit value');
        let userAfter = JSON.parse(await viewer.getUserInfo(user.getID()));
>>>>>>> origin/main

        assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
      }
    });
  });
});




describe('addEggCredits', function () {
  describe('0 → adds 0 creds && 1 → adds 1 creds && 10000 → adds 10000 creds', function () {
    it('should have correct num of univ credit', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
<<<<<<< HEAD
      contr.addFolder(folderName, "desc", "eggType");
      // CHECK: taskFolderInfoStr
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderBefore = JSON.parse(taskFolderInfoStr);
          contr.addEggCredits(num, folderName);
          taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderAfter = JSON.parse(taskFolderInfoStr);
=======
      await contr.addFolder(user.getID(), folderName, "desc", "eggType")
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
          await contr.addEggCredits(user.getID(), num, folderName);
          let folderAfter = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
>>>>>>> origin/main
  
          assert.strictEqual(folderBefore.eggCredits + num, folderAfter.eggCredits);
        }
      }
      // cases 0, 1, 10000
      await checker(0);
      await checker(1);
      await checker(10000);
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
<<<<<<< HEAD
      contr.addFolder(folderName, "desc", "eggType")
      // Check: taskFolderInfoStr / Promise return
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderBefore = JSON.parse(taskFolderInfoStr);
          assert.throws(() => contr.addEggCredits(num, folderName), Error, 'Illegal operation: negative credit value');
          taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderAfter = JSON.parse(taskFolderInfoStr);
=======
      await contr.addFolder(user.getID(), folderName, "desc", "eggType")
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
          assert.rejects(async () => await contr.addEggCredits(user.getID(), num, folderName), Error, 'Illegal operation: negative credit value');
          let folderAfter = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
>>>>>>> origin/main
  
          assert.strictEqual(folderBefore.eggCredits, folderAfter.eggCredits);
        }
      }
      // -1, 10000 cases
      await checker(-1);
      await checker(-10000);
    });
  });
});


describe('removeEggCredits', function () {
  describe('0 → adds 0 creds && 1 → removes 1 creds && 10000 → removes 10000 creds', function () {
    it('should have correct num of univ credit', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
<<<<<<< HEAD
      contr.addFolder(folderName, "desc", "eggType")
      // Check: taskFolderInfoStr / return Promise<void>
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderBefore = JSON.parse(taskFolderInfoStr);
          contr.removeEggCredits(num, folderName);
          taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderAfter = JSON.parse(taskFolderInfoStr);
=======
      await contr.addFolder(user.getID(), folderName, "desc", "eggType")
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
          await contr.removeEggCredits(user.getID(), num, folderName);
          let folderAfter = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
>>>>>>> origin/main
  
          assert.strictEqual(folderBefore.eggCredits - num, folderAfter.eggCredits);
        }
      }
      // cases 0, 1, 10000
      await checker(0);
      await checker(1);
      await checker(10000);
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && num credits stays the same', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
<<<<<<< HEAD
      contr.addFolder(folderName, "desc", "eggType")
      // Check: taskFolderInfoStr / return Promise<void>
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderBefore = JSON.parse(taskFolderInfoStr);
          assert.throws(() => contr.removeEggCredits(num, folderName), Error, 'Illegal operation: negative credit value');
          taskFolderInfoStr = await viewer.getTaskFolderInfo(user.getID(), folderName);
          let folderAfter = JSON.parse(taskFolderInfoStr);
=======
      await contr.addFolder(user.getID(), folderName, "desc", "eggType")
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let folderBefore = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
          assert.rejects(async () => await contr.removeEggCredits(user.getID(), num, folderName), Error, 'Illegal operation: negative credit value');
          let folderAfter = JSON.parse(await viewer.getTaskFolderInfo(user.getID(), folderName));
>>>>>>> origin/main
  
          assert.strictEqual(folderBefore.eggCredits, folderAfter.eggCredits);
        }
      }
      // -1, 10000 cases
      await checker(-1);
      await checker(-10000);
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
    it('should have correct data shown for Acc && return true', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        await contr.addUnivCredits(user.getID(), 10000 * MAX_CASES);
        for (let i = 0; i < MAX_CASES; i++) {
          let ret = await contr.buyAccessory(user.getID(), folderName, "acc1");
          let folder = user.getTaskFolders().get(folderName);
          assert(folder !== undefined);
          let accs = folder.getEgg().getOwnedAccessories();  // should have exactly one acc
          accs.forEach(async function (accType) {
            const accessory = await contr.getEggManager().getAccessory(accType);
            assert(accessory !== undefined);
            assert.strictEqual(accessory.cost, 100);
            assert.strictEqual(accessory.name, "acc1");
            assert.strictEqual(accessory.graphicLink, "");
          });
          folder.getEgg().getOwnedAccessories().clear();
          assert(ret);
        }
      }
    });
  });
  // 'you already purchased this accessory'

  describe('credit-check case when eggCredits >= cost', function () {
    it('should spends egg-specific credits + return true', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        let eggCredits = 10000 * MAX_CASES;
        await contr.addEggCredits(user.getID(), eggCredits, folderName);
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          assert(await contr.buyAccessory(user.getID(), folderName, "acc1"));
          eggCredits -= 100;  // default accesory cost
          assert.strictEqual(eggCredits, folder.getEggCredits());
          folder.getEgg().getOwnedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when eggCredits < cost but can still afford', function () {
    it('should return true && eggCredits == 0 && univCredits -= (cost - eggCredits)', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        let univCredits = MAX_CASES * 100;
        await contr.addUnivCredits(user.getID(), univCredits);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          await contr.addEggCredits(user.getID(), eggCredits, folderName);  // varying egg credits
          assert(await contr.buyAccessory(user.getID(), folderName, "acc1"));
          univCredits -= (100 - eggCredits);
          assert.strictEqual(0, folder.getEggCredits());
          assert.strictEqual(univCredits, user.getUnivCredits());
          folder.getEgg().getOwnedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when there are not enough credits', function () {
    it('should return false and spend no credits', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          await contr.addEggCredits(user.getID(), eggCredits, folderName);  // varying egg credits
          assert(! (await contr.buyAccessory(user.getID(), folderName, "acc1")) );  // assert we cannot buy
          assert.strictEqual(eggCredits, folder.getEggCredits());
          await contr.removeEggCredits(user.getID(), eggCredits, folderName);
        }
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      await contr.addFolder(user.getID(), folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.buyAccessory(user.getID(), folderName + i, "acc1"), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('accessory/inter not allowed → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      await contr.addFolder(user.getID(), folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.buyAccessory(user.getID(), folderName, "fakeAcc" + i), Error,
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
    it('should have exp is correctly gained && return true', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        await contr.addUnivCredits(user.getID(), 10000 * MAX_CASES);
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        let exp = folder.getEgg().getExp();
        for (let i = 0; i < MAX_CASES; i++) {
          assert(await contr.buyInteraction(user.getID(), folderName, "inter1"));
          exp += 100;  // default exp value
          assert.strictEqual(exp, folder.getEgg().getExp());
        }
      }
    });
  });
  // 'you already purchased this accessory'

  describe('credit-check case when eggCredits >= cost', function () {
    it('should spends egg-specific credits + return true', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        let eggCredits = 10000 * MAX_CASES;
        await contr.addEggCredits(user.getID(), eggCredits, folderName);
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          assert(await contr.buyInteraction(user.getID(), folderName, "inter1"));
          eggCredits -= 100;  // default accesory cost
          assert.strictEqual(eggCredits, folder.getEggCredits());
          folder.getEgg().getOwnedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when eggCredits < cost but can still afford', function () {
    it('should return true && eggCredits == 0 && univCredits -= (cost - eggCredits)', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        let univCredits = MAX_CASES * 100;
        await contr.addUnivCredits(user.getID(), univCredits);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          await contr.addEggCredits(user.getID(), eggCredits, folderName);  // varying egg credits
          assert(await contr.buyInteraction(user.getID(), folderName, "inter1"));
          univCredits -= (100 - eggCredits);
          assert.strictEqual(0, folder.getEggCredits());
          assert.strictEqual(univCredits, user.getUnivCredits());
          folder.getEgg().getOwnedAccessories().clear();
        }
      }
    });
  });
  describe('credit-check case when there are not enough credits', function () {
    it('should return false and spend no credits', async function () {
      // can only test if DB is not there
      let contr = getContr();
      if (!contr.getEggManager().USE_DB) {
        let user = await getDefaultUser(contr);
        let viewer = getViewer(contr);
        let folderName = "name";
        await contr.addFolder(user.getID(), folderName, "desc", "egg1");
        let folder = user.getTaskFolders().get(folderName);
        assert(folder !== undefined);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggCredits = 50 + (i % 17);
          await contr.addEggCredits(user.getID(), eggCredits, folderName);  // varying egg credits
          assert( !(await (contr.buyInteraction(user.getID(), folderName, "inter1")) ));  // assert we cannot buy
          assert.strictEqual(eggCredits, folder.getEggCredits());
          await contr.removeEggCredits(user.getID(), eggCredits, folderName);
        }
      }
    });
  });
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      await contr.addFolder(user.getID(), folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.buyInteraction(user.getID(), folderName + i, "inter1"), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('accessory/inter not allowed → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      await contr.addFolder(user.getID(), folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.buyInteraction(user.getID(), folderName, "fakeInter" + i), Error,
                      'not allowed to buy this interaction');
      }
    });
  });
});



describe('gainExp', function () {
  describe('folder DNE (does not exist) → exception', function () {
    it('should throw an error', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let folderName = "name ";
      await contr.addFolder(user.getID(), folderName, "desc", "egg1");
      for (let i = 0; i < MAX_CASES; i++) {
        // test here
        assert.rejects(async () => await contr.gainExp(user.getID(), 1000, folderName + i), Error,
                      'The folder name does not exist');
      }
    });
  });
  describe('0 → adds 0 creds && 1 → adds 1 creds && 100 → adds 100 creds', function () {
    // for reference, in EggManager; stages 1-5 are:
    //    let bounds = [100, 200, 300, 400, 500];
    it('should gain correct exp and correctly evolve (right stage)', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      await contr.addFolder(user.getID(), folderName, "desc", "egg1")
      let folder = user.getTaskFolders().get(folderName);
      assert(folder !== undefined);
      let maxLevels = 5;
      async function checker(num: number, checkLevels: boolean, offByOne: boolean = false): Promise<void> {
        let exp = 0;
        let firstTime = true;
        if (offByOne) {
          num -= 1;
        }
        for (let i = 0; i < maxLevels; i++) {
          // exp check
          await contr.gainExp(user.getID(), num, folderName);
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
      await checker(0, false);
      await checker(1, false);
      await checker(100, true);
      await checker(100, true, true);  // off-by-one case
    });
  });
  describe('-1 → exception && -10000 → exception', function () {
    it('should throw an error && egg stays the same', async function () {
      let contr = getContr();
      let user = await getDefaultUser(contr);
      let viewer = getViewer(contr);
      let folderName = "name";
      await contr.addFolder(user.getID(), folderName, "desc", "eggType")
      async function checker(num: number): Promise<void> {
        for (let i = 0; i < MAX_CASES; i++) {
          let eggBefore = await viewer.getEggInfo(user.getID(), folderName);
          assert.rejects(async () => await contr.gainExp(user.getID(), num, folderName), Error, 'Illegal operation: negative credit value');
          let eggAfter = await viewer.getEggInfo(user.getID(), folderName);
  
          assert.strictEqual(eggBefore, eggAfter);
        }
      }
      // -1, 10000 cases
      await checker(-1);
      await checker(-10000);
    });
  });
});