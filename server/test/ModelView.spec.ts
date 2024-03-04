// Unit tests for ModelView

import assert from 'assert';
import { IDManager } from '../src/model/IDManager';
import { User } from '../src/model/User';
import { Task } from '../src/model/Task';
import { TaskFolder } from '../src/model/TaskFolder';
import { ModelView } from '../src/ModelView';
import { EggManager } from '../src/model/EggManager';
import { UserID } from '../src/types/UserID';
import { TaskID } from '../src/types/TaskID';

const MAX_CASES = 100

describe('getUserInfo', function () {
  describe('normal use case with full JSON', function () {
    it('should return correct user data', async function () {
      let man = new IDManager();
      let eggMan = new EggManager();
      let modelView = new ModelView(man, eggMan);
      for (let i = 0; i < MAX_CASES; i++) {
        let user = new User(man, "username", "password");
        user.setStreak(i);
        user.setUnivCredits(1000 * i);
        let folder = new TaskFolder("name", "desc", "eggType");
        user.getTaskFolders().set(folder.getName(), folder);
        let task = new Task(man, "taskname", "desc", [], user.getID(),[]);
        folder.getTasks().set(task.getID(), task);

        // test here
        let actual = await modelView.getUserInfo(user.getID());
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(user.getJSON(), actual);
      }
    });
    describe('non-existent UserID → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        let user = new User(man, "username", "password");
        for (let i = 0; i < MAX_CASES; i++) {
          let id: UserID = {
            id: user.getID() + i.toString()
          };
          // test here
          assert.strictEqual("", await modelView.getUserInfo(id));
        }
      });
    });
  });
});

describe('getTaskInfo', function () {
  describe('normal use case with full JSON', function () {
    it('should return correct task data', async function () {
      let man = new IDManager();
      let eggMan = new EggManager();
      let modelView = new ModelView(man, eggMan);
      let user = new User(man, "username", "password");
      let folder = new TaskFolder("name", "desc", "eggType");
      user.getTaskFolders().set(folder.getName(), folder);
      for (let i = 0; i < MAX_CASES; i++) {
        let taskName = "task " + i.toString();
        let task = new Task(man, taskName, "desc", [], user.getID(),[]);
        folder.getTasks().set(task.getID(), task);

        // test here
        let actual = await modelView.getTaskInfo(user.getID(), task.getID());
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(task.getJSON() ,  actual);
      }
    });
    describe('non-existent TaskID → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        let user = new User(man, "username", "password");
        let folder = new TaskFolder("name", "desc", "eggType");
        let task = new Task(man, "taskname", "desc", [], user.getID(),[]);
        folder.getTasks().set(task.getID(), task);
        for (let i = 0; i < MAX_CASES; i++) {
          let id: TaskID = {
            id: task.getID() + i.toString()
          };
          // test here
          assert.strictEqual("", await modelView.getTaskInfo(user.getID(), id));
        }
      });
    });
  });
});

describe('getTaskFolderInfo', function () {
  describe('normal use case with full JSON', function () {
    it('should return correct taskFolder data', async function () {
      let man = new IDManager();
      let eggMan = new EggManager();
      let modelView = new ModelView(man, eggMan);
      let user = new User(man, "username", "password");
      for (let i = 0; i < MAX_CASES; i++) {
        let folder = new TaskFolder("name " + i, "desc " + i, "eggType " + i);
        user.getTaskFolders().set(folder.getName(), folder);

        // test here
        let actual = await modelView.getTaskFolderInfo(user.getID(), folder.getName());
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(folder.getJSON() ,  actual);
      }
    });
    describe('non-existent UserID → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        let user = new User(man, "username", "password");
        let folder = new TaskFolder("name", "desc", "eggType");
        user.getTaskFolders().set(folder.getName(), folder);
        for (let i = 0; i < MAX_CASES; i++) {
          let id: UserID = {
            id: user.getID() + i.toString()
          };
          // test here
          assert.strictEqual("",  await modelView.getTaskFolderInfo(id, folder.getName()));
        }
      });
    });
    describe('non-existent folder name → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        let user = new User(man, "username", "password");
        let folder = new TaskFolder("name ", "desc", "eggType");
        user.getTaskFolders().set(folder.getName(), folder);
        for (let i = 0; i < MAX_CASES; i++) {
          let folderName = folder.getName() + i;
          // test here
          assert.strictEqual("",  await modelView.getTaskFolderInfo(user.getID(), folderName));
        }
      });
    });
  });
});




describe('getEggInfo', function () {
  describe('normal use case with full JSON', function () {
    it('should return correct Egg data', async function () {
      let man = new IDManager();
      let eggMan = new EggManager();
      let modelView = new ModelView(man, eggMan);
      let user = new User(man, "username", "password");
      for (let i = 0; i < MAX_CASES; i++) {
        let folder = new TaskFolder("name " + i, "desc " + i, "eggType " + i);
        user.getTaskFolders().set(folder.getName(), folder);
        let egg = folder.getEgg();
        egg.setEggStage(i);
        egg.setExp(1000 * i);


        // test here
        let actual = await modelView.getEggInfo(user.getID(), folder.getName());
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(egg.getJSON() ,  actual);
      }
    });
    describe('non-existent UserID → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        let user = new User(man, "username", "password");
        let folder = new TaskFolder("name", "desc", "eggType");
        user.getTaskFolders().set(folder.getName(), folder);
        for (let i = 0; i < MAX_CASES; i++) {
          let id: UserID = {
            id: user.getID() + i.toString()
          };
          // test here
          assert.strictEqual("",  await modelView.getEggInfo(id, folder.getName()));
        }
      });
    });
    describe('non-existent folder name → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        let user = new User(man, "username", "password");
        let folder = new TaskFolder("name ", "desc", "eggType");
        user.getTaskFolders().set(folder.getName(), folder);
        for (let i = 0; i < MAX_CASES; i++) {
          let folderName = folder.getName() + i;
          // test here
          assert.strictEqual("",  await modelView.getEggInfo(user.getID(), folderName));
        }
      });
    });
  });
});


describe('getEggType', function () {
  describe('normal use case with full JSON', function () {
    it('should return correct EggType data', async function () {
      /* for reference, this test ONLY runs when DB flag is set to false:
         the following is dummy data from EggManager:
      this.eggTypes.set("egg1", this.makeEggType("egg1"))
      this.eggTypes.set("egg2", this.makeEggType("egg2"))

      this.interactions.set("inter1", this.makeInteraction("inter1"))
      this.interactions.set("inter2", this.makeInteraction("inter2"))

      this.accessories.set("acc1", this.makeAccessory("acc1"))
      this.accessories.set("acc2", this.makeAccessory("acc2"))
      */
      let man = new IDManager();
      let eggMan = new EggManager();
      let modelView = new ModelView(man, eggMan);
      if (!eggMan.USE_DB) {
        // test here
        let expected = await eggMan.getEggTypeJSON("egg1");
        let actual = await modelView.getEggType("egg1");
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(expected ,  actual);

        expected = await eggMan.getEggTypeJSON("egg2");
        actual = await modelView.getEggType("egg2");
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(expected ,  actual);
      }
    });
    describe('non-existent eggType → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        for (let i = 0; i < MAX_CASES; i++) {
          let eggType = i.toString();
          // test here
          assert.strictEqual("",  await modelView.getEggType(eggType));
        }
      });
    });
  });
});


describe('getInteraction', function () {
  describe('normal use case with full JSON', function () {
    it('should return correct Interaction data', async function () {
      /* for reference, this test ONLY runs when DB flag is set to false:
         the following is dummy data from EggManager:
      this.eggTypes.set("egg1", this.makeEggType("egg1"))
      this.eggTypes.set("egg2", this.makeEggType("egg2"))

      this.interactions.set("inter1", this.makeInteraction("inter1"))
      this.interactions.set("inter2", this.makeInteraction("inter2"))

      this.accessories.set("acc1", this.makeAccessory("acc1"))
      this.accessories.set("acc2", this.makeAccessory("acc2"))
      */
      let man = new IDManager();
      let eggMan = new EggManager();
      let modelView = new ModelView(man, eggMan);
      if (!eggMan.USE_DB) {
        // test here
        let expected = await eggMan.getInteractionJSON("inter1");
        let actual = await modelView.getInteraction("inter1");
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(expected ,  actual);

        expected = await eggMan.getInteractionJSON("inter2");
        actual = await modelView.getInteraction("inter2");
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(expected, actual);
      }
    });
    describe('non-existent eggType → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        for (let i = 0; i < MAX_CASES; i++) {
          let interaction = i.toString();
          // test here
          assert.strictEqual("", await modelView.getInteraction(interaction));
        }
      });
    });
  });
});

describe('getAccessory', function () {
  describe('normal use case with full JSON', function () {
    it('should return correct Accessory data', async function () {
      /* for reference, this test ONLY runs when DB flag is set to false:
         the following is dummy data from EggManager:
      this.eggTypes.set("egg1", this.makeEggType("egg1"))
      this.eggTypes.set("egg2", this.makeEggType("egg2"))

      this.interactions.set("inter1", this.makeInteraction("inter1"))
      this.interactions.set("inter2", this.makeInteraction("inter2"))

      this.accessories.set("acc1", this.makeAccessory("acc1"))
      this.accessories.set("acc2", this.makeAccessory("acc2"))
      */
      let man = new IDManager();
      let eggMan = new EggManager();
      let modelView = new ModelView(man, eggMan);
      if (!eggMan.USE_DB) {
        // test here
        let expected = await eggMan.getAccessoryJSON("acc1");
        let actual = await modelView.getAccessory("acc1");
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(expected, actual);

        expected = await eggMan.getAccessoryJSON("acc2");
        actual = await modelView.getAccessory("acc2");
        // console.log(actual)   // to verify data looks good
        assert.strictEqual(expected, actual);
      }
    });
    describe('non-existent eggType → empty string', function () {
      it('should return empty string', async function () {
        let man = new IDManager();
        let eggMan = new EggManager();
        let modelView = new ModelView(man, eggMan);
        for (let i = 0; i < MAX_CASES; i++) {
          let acc = i.toString();
          // test here
          assert.strictEqual("", await modelView.getAccessory(acc));
        }
      });
    });
  });
});