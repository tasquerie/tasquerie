// Unit tests for IDManager

import assert from 'assert';
import { IDManager } from '../src/model/IDManager';
import { User } from '../src/model/User';
import { Task } from '../src/model/Task';
import { UserID } from '../src/types/UserID';
import { TaskID } from '../src/types/TaskID';
import { ModelController } from '../src/ModelController';
import { EggManager } from '../src/model/EggManager';
import { UserManager } from '../src/model/UserManager';
import { WriteManager } from '../src/model/WriteManager';

const MAX_CASES = 100000

describe('Next UserID Function', function () {
  describe('unique', function () {
    it('should always return a uniqueID', async function () {
      let ids = new Set<string>();
      let man = new IDManager();
      for (let i = 0; i < MAX_CASES; i++) {
        let nextID = await man.nextUserID(undefined);
        assert(!ids.has(nextID.id));
        ids.add(nextID.id);
      }
    });
  });
});

describe('Next TaskID Function', function () {
  describe('unique', function () {
    it('should always return a uniqueID', function () {
      let ids = new Set<string>();
      let man = new IDManager();
      for (let i = 0; i < MAX_CASES; i++) {
        let nextID = man.nextTaskID(undefined);
        assert(!ids.has(nextID.id));
        ids.add(nextID.id);
      }
    });
  });
});

describe('getUserByID Function', function () {
  describe('get normal', function () {
    it('should get users that exist', async function () {
      let man = new IDManager();
      for (let i = 0; i < MAX_CASES; i++) {
        let user = new User(man, "", "");
        let id = user.getID();
        assert.strictEqual( (await man.getUserByID(id)).content, user);
      }
    });
  });
  describe('get bad', function () {
    it('should not get users that do not exist', async function () {
      let man = new IDManager();
      let id_num = 0;
      let userID: UserID = {
        id: id_num.toString()
      }
      for (let i = 0; i < MAX_CASES; i++) {
        assert.strictEqual((await man.getUserByID(userID)).content, undefined);
        id_num += 1;
        userID.id = id_num.toString();
      }
    });
  });
});

describe('getTaskByID Function', function () {
  describe('get normal', function () {
    it('should get tasks that exist', async function () {
      let man = new IDManager();
      const userID: UserID = {
        id: "0"
      }
      for (let i = 0; i < MAX_CASES; i++) {
        let task = new Task(man, "", "", [], userID, []);
        let id = task.getID();
        assert.strictEqual( (await man.getTaskByID(userID, id)).content, task);
      }
    });
  });
  describe('get bad', function () {
    it('should not get tasks that do not exist', async function () {
      let man = new IDManager();
      let id_num = 0;
      let taskID: TaskID = {
        id: id_num.toString()
      }
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let userMan = new UserManager(man);
      let model = new ModelController(userMan, man, eggMan, writeMan);
      let userIDString = await model.signup("username", "password");
      let userID: UserID = {
        id: userIDString
      }
      for (let i = 0; i < MAX_CASES; i++) {
        assert.strictEqual((await man.getTaskByID(userID, taskID)).content, undefined);
        id_num += 1;
        taskID.id = id_num.toString();
      }
    });
  });
});