// Unit tests for ModelController

import { strict as assert } from 'assert';
import { IDManager } from '../src/model/IDManager';
import { UserManager } from '../src/model/UserManager';
import { EggManager } from '../src/model/EggManager';
import { ModelController } from '../src/ModelController';
import { WriteManager } from '../src/model/WriteManager';
import { ModelView } from '../src/ModelView';

const MAX_CASES = 1000;
const MAX_PASS_LEN = 8;

describe('login', function () {
  describe('correct login info → return true', function () {
    it('should return true', function () {
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
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
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
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
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
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
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
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
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
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
    it('can login with username and password after signup and logging out', function () {
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
      for (let i = 0; i < MAX_CASES; i++) {
        let username = "user " + i;
        let password = "password " + i;
        contr.signup(username, password);
        contr.logout();
        assert(contr.login(username, password));
      }
    });
  });
  describe('username already exists → throw exc', function () {
    it('should throw an error', function () {
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
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
      let idMan = new IDManager();
      let userMan = new UserManager(idMan);
      let eggMan = new EggManager();
      let writeMan = new WriteManager();
      let contr = new ModelController(userMan, idMan, eggMan, writeMan);
      let password = ""
      for (let i = 0; i < MAX_PASS_LEN; i++) {
        let username = "user " + i;
        assert.throws(() => contr.signup(username, password), Error, 'Password must be at least 8 characters long.');
        password += "a";
      }
      // NOW PASSWORD IS LENGTH 8 --> SHOULD WORK
      for (let i = 0; i < MAX_PASS_LEN; i++) {
        let username = "user " + i;
        console.log("pass: " + password);
        assert.doesNotThrow(() => contr.signup(username, password));
        password += "a";
      }
    });
  });
});