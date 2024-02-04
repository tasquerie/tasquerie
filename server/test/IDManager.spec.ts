// Unit tests for IDManager

import assert from 'assert';
import { IDManager } from '../src/model/IDManager';
import { User } from '../src/model/User';
import { Task } from '../src/model/Task';
import { UserID } from '../src/types/UserID';
import { TaskID } from '../src/types/TaskID';

describe('Next UserID Function', function () {
  describe('unique', function () {
    it('should always return a uniqueID', function () {
      let ids = new Set<number>();
      let man = new IDManager();
      for (let i = 0; i < 100000; i++) {
        let nextID = man.nextUserID(undefined);
        assert(!ids.has(nextID.id));
        ids.add(nextID.id);
      }
    });
  });
});

describe('Next TaskID Function', function () {
  describe('unique', function () {
    it('should always return a uniqueID', function () {
      let ids = new Set<number>();
      let man = new IDManager();
      for (let i = 0; i < 100000; i++) {
        let nextID = man.nextTaskID(undefined);
        assert(!ids.has(nextID.id));
        ids.add(nextID.id);
      }
    });
  });
});

describe('getUserByID Function', function () {
  describe('get normal', function () {
    it('should get users that exist', function () {
      let man = new IDManager();
      for (let i = 0; i < 100000; i++) {
        let user = new User(man, "", "");
        let id = user.getID();
        assert.strictEqual(man.getUserByID(id), user);
      }
    });
  });
  describe('get bad', function () {
    it('should not get users that do not exist', function () {
      let man = new IDManager();
      let userID: UserID = {
        id: 0
      }
      for (let i = 0; i < 100000; i++) {
        assert.strictEqual(man.getUserByID(userID), undefined);
        userID.id += 1;
      }
    });
  });
});

describe('getTaskByID Function', function () {
  describe('get normal', function () {
    it('should get tasks that exist', function () {
      let man = new IDManager();
      const userID: UserID = {
        id: 0
      }
      for (let i = 0; i < 100000; i++) {
        let task = new Task(man, "", "", [], userID, []);
        let id = task.getID();
        assert.strictEqual(man.getTaskByID(id), task);
      }
    });
  });
  describe('get bad', function () {
    it('should not get tasks that do not exist', function () {
      let man = new IDManager();
      let taskID: TaskID = {
        id: 0
      }
      for (let i = 0; i < 100000; i++) {
        assert.strictEqual(man.getTaskByID(taskID), undefined);
        taskID.id += 1;
      }
    });
  });
});