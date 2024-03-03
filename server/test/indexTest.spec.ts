import app from '../src/server/index';
import request from 'supertest';
import {Response} from 'supertest';
import { strict as assert } from 'assert';
import { IDManager } from '../src/model/IDManager';
import { UserManager } from '../src/model/UserManager';
import { EggManager } from '../src/model/EggManager';
import { ModelController } from '../src/ModelController';
import { ModelView } from '../src/ModelView';
import { WriteManager } from '../src/model/WriteManager';
import { UserID } from "../src/types/UserID";
import { TaskFolder } from '../src/model/TaskFolder';
import {getIDMan, getContr, getViewer} from '../src/server/index';

const idMan = getIDMan();
const contr = getContr();
const viewer = getViewer();

describe('Route /login', () => {
    it('no function case', async() => {
        const res1:Response = await request(app).post('/login');
        assert.strictEqual(res1.statusCode, 400);
        assert.strictEqual(res1.body, 'The function of the request is not defined');
    });
    describe('signup', () => {
        it ('no username case', async() => {
            const res2:Response = await request(app).post('/login').send({func:'signup'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'username is not defined or is not a string');
        });

        it ('no password case', async() => {
            const res3:Response = await request(app).post('/login').send({func:'signup', username:'USERNAME'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'password is not defined or is not a string');
        });

        it ('success case', async() => {
            const res4:Response = await request(app).post('/login').send({func:'signup', username:'USERNAME', password: 'PASSWORD'});
            const userID: UserID = {
                id: res4.text
            }
            const user = idMan.getUserByID(userID);
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.text, user?.getID().id);
        });

        it ('existing username case', async() => {
            const res5:Response = await request(app).post('/login').send({func:'signup', username:'USERNAME', password: 'DIFFERENT'});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Username already exists!');
        });

        it ('password length < 8 case', async() => {
            const res6:Response = await request(app).post('/login').send({func:'signup', username:'USER1', password: 'SMALL'});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'Password must be at least 8 characters long.');
        });
    });
    // Current Contr State:
    // User signup: USERNAME | PASSWORD

    describe('login', () => {
        it('no username case', async() => {
            const res2:Response = await request(app).post('/login').send({func:'login'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'username is not defined or is not a string');
        });

        it('no password case', async() => {
            const res3:Response = await request(app).post('/login').send({func:'login', username:'USERNAME'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'password is not defined or is not a string');
        });

        it('wrong password', async() => {
            contr.signup("USER1", "CORRECTPW");
            const res4:Response = await request(app).post('/login').send({func:'login', username:'USERNAME', password:'WRONGPW'});
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.text, 'false');
        });

        it('correct login', async() => {
            const res5:Response = await request(app).post('/login').send({func:'login', username:'USER1', password:'CORRECTPW'});
            assert.strictEqual(res5.statusCode, 200);
            assert.strictEqual(res5.text, 'true');
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // User login: USER1

    describe('logout', () => {
        it('logout', async() => {
            contr.login("USER1", "CORRECTPW");
            const res2:Response = await request(app).post('/login').send({func:'logout'});
            assert.strictEqual(res2.statusCode, 200);
            assert(!contr.isLoggedIn());
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
});

describe('Route /controller', () => {
    it('no function case', async() => {
        const res1:Response = await request(app).post('/controller');
        assert.strictEqual(res1.statusCode, 400);
        assert.strictEqual(res1.body, 'The function of the request is not defined');
    });
    describe('addFolder', () => {
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addFolder'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('no description case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'addFolder', name:'FolderName'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The description of the folder is undefined or is not a string');
        });

        it('no eggType case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'addFolder', name:'FolderName', description:'Description'});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The egg type of the folder is undefined or is not a string');
        });

        it('user not signed in case', async() => {
            const res5:Response = await request(app).post('/controller').send({func:'addFolder', name:'FolderName', description:'Description', eggType:'EggType'});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: user is not signed-in!');
        });

        it('correct case', async() => {
            contr.login("USER1", "CORRECTPW");
            const res6:Response = await request(app).post('/controller').send({func:'addFolder', name:'folderName1', description:'desc', eggType:'eggType'});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.text, 'addFolder');
        });

        it('existing folders', async() => {
            const res7:Response = await request(app).post('/controller').send({func:'addFolder', name:'folderName1', description:'desc2', eggType:'eggType2'});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'Duplicated value: the given folder name already exists');
            contr.logout();
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // USER1-TaskFolder: folderName1

    describe('setFolder', () => {
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'setFolder'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('new name != (undefined && string) case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'setFolder', name:'FolderName', newName:5});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The type of the new name is not a string but is defined');
        });

        it('description != (undefined && string) case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'setFolder', name:'FolderName', description:5});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The type of the description is not a string but is defined');
        });

        it('user not signed in case', async() => {
            const res5:Response = await request(app).post('/controller').send({func:'setFolder', name:'FolderName', description:'new Desc'});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: user is not signed-in!');
        });

        it('folder name doesn\'t exist case', async() => {
            contr.login("USER1", "CORRECTPW");
            const res6:Response = await request(app).post('/controller').send({func:'setFolder', name:'CheckFolderName', description:'new Desc'});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });

        it('existing folder with newName case', async() => {
            contr.addFolder("ExistingName", "desc", "eggType");
            const res7:Response = await request(app).post('/controller').send({func:'setFolder', name:'folderName1', newName:'ExistingName'});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'Duplicated value: the new folder name already exists');
        });

        it('correct case', async() => {
            // No newName && newDesc
            const res8:Response = await request(app).post('/controller').send({func:'setFolder', name:'folderName1'});
            assert.strictEqual(res8.statusCode, 200);
            assert.strictEqual(res8.text, 'setFolder');

            // Only newName
            const res9:Response = await request(app).post('/controller').send({func:'setFolder', name:'folderName1', newName:'newName'});
            assert.strictEqual(res9.statusCode, 200);
            assert.strictEqual(res9.text, 'setFolder');

            // Only newDesc
            const res10:Response = await request(app).post('/controller').send({func:'setFolder', name:'newName', description:'newDesc'});
            assert.strictEqual(res10.statusCode, 200);
            assert.strictEqual(res10.text, 'setFolder');

            // Both newName && newDesc
            const res11:Response = await request(app).post('/controller').send({func:'setFolder', name:'newName', newName:'folderName1', description:'desc1'});
            assert.strictEqual(res11.statusCode, 200);
            assert.strictEqual(res11.text, 'setFolder');
            contr.logout();
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // USER1-TaskFolder: folderName1
    describe('deleteFolder', () => {
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'deleteFolder'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('user not signed in case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'deleteFolder', name:'folderName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'Illegal operation: user is not signed-in!');
        });

        it('folder name doesn\'t exist case', async() => {
            contr.login("USER1", "CORRECTPW");
            const res4:Response = await request(app).post('/controller').send({func:'deleteFolder', name:'CheckFolderName'});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The folder name does not exist');
        });

        it('correct case', async() => {
            contr.addFolder("deleteThisFolder", "deleteDesc", "deleteEgg");
            const res5:Response = await request(app).post('/controller').send({func:'deleteFolder', name:'deleteThisFolder'});
            assert.strictEqual(res5.statusCode, 200);
            assert.strictEqual(res5.text, 'deleteFolder');
            contr.logout();
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // USER1-TaskFolder: folderName1
    describe('addTask', () => {
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addTask'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('no task name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the task is undefined or is not a string');
        });

        
    });
});

// describe('Route /view', () => {
//     it('no function case', async() => {
//         const res1:Response = await request(app).get('/view');
//         assert.strictEqual(res1.statusCode, 400);
//         assert.strictEqual(res1.text, 'The function of the request is not defined');
//     });
//     it('getUserInfo', async() => {
//         const res2:Response = await request(app).get('/view?func=getUserInfo');
//         assert.strictEqual(res2.statusCode, 400);
//         assert.strictEqual(res2.text, 'id is not defined or is not a string');

//         const id = contr.signup("username", "password");
//         const userID:UserID = {id:id}
//         const res3:Response = await request(app).get('/view?func=getUserInfo&id=' + id);
//         assert.strictEqual(res3.statusCode, 200);
//         assert.strictEqual(res3.text, "" + userID);

//         //Need test if the user is undefined when db is ready
//     });
//     it('getTaskInfo', async() => {
//         const res2:Response = await request(app).get('/view?func=getTaskInfo');
//         assert.strictEqual(res2.statusCode, 400);
//         assert.strictEqual(res2.text, 'id is not defined or is not a string');

//         // const id = contr.signup("username", "password");
//         // const userID:UserID = {id:id}
//         // const res3:Response = await request(app).get('/view?func=getTaskInfo&id=' + id);
//         // assert.strictEqual(res3.statusCode, 200);
//         // assert.strictEqual(res3.text, "" + userID);

//         //Need test if the user is undefined when db is ready
//     });
// });
// const MAX_CASES = 1000;
// const MAX_PASS_LEN = 8;

////       LOGIN METHODS         ////

// function getContr(): ModelController {
//   let idMan = new IDManager();
//   let userMan = new UserManager(idMan);
//   let eggMan = new EggManager();
//   let writeMan = new WriteManager();
//   return new ModelController(userMan, idMan, eggMan, writeMan);
// }
// function getDefaultUser(contr: ModelController): User {
//   let username = "username";
//   let password = "password";
//   contr.signup(username, password);  // already logged in
//   let user = contr.getCurrentUser();
//   assert(user !== undefined);
//   return user;
// }
// function getViewer(contr: ModelController): ModelView {
//   return new ModelView(contr.getIDManager(), contr.getEggManager());
// }

// describe('login', function () {
//   describe('correct login info → return true', function () {
//     it('should return true', function () {
//       let contr = getContr();
//       for (let i = 0; i < MAX_CASES; i++) {
//         let username = "user " + i;
//         let password = "password " + i;
//         contr.signup(username, password);
//         assert(contr.login(username, password));
//       }
//     });
//   });
//   describe('bad username → returns false + not logged in', function () {
//     it('should return false and check user is not logged in', function () {
//       let contr = getContr();
//       let username = "user ";
//       let password = "password ";
//       contr.signup(username, password);
//       contr.logout();
//       for (let i = 0; i < MAX_CASES; i++) {
//         assert(!contr.login(username + i, password));
//         assert(!contr.isLoggedIn());
//       }
//     });
//   });
//   describe('bad password → returns false + not logged in', function () {
//     it('should return false and check user is not logged in', function () {
//       let contr = getContr();
//       let username = "user ";
//       let password = "password ";
//       contr.signup(username, password);
//       contr.logout();
//       for (let i = 0; i < MAX_CASES; i++) {
//         assert(!contr.login(username, password + i));
//         assert(!contr.isLoggedIn());
//       }
//     });
//   });
//   describe('correct login, bad user, bad password interlaced', function () {
//     it('should return true for good login, false for bad', function () {
//       let contr = getContr();
//       for (let i = 0; i < MAX_CASES; i++) {
//         let username = "user " + i;
//         let password = "password " + i;
//         contr.signup(username, password);
//         assert(contr.login(username, password));
//         assert(!contr.login(username + "k", password));
//         assert(!contr.login(username, password + "k"));
//         assert(!contr.login(username + "k", password + "k"));
//       }
//     });
//   });
// });



// describe('login', function () {
//   describe('logged in → logged out && logged out → still logged out', function () {
//     it('should be logged out', function () {
//       let contr = getContr();
//       for (let i = 0; i < MAX_CASES; i++) {
//         let username = "user " + i;
//         let password = "password " + i;
//         contr.signup(username, password);
//         assert(contr.login(username, password));
//         assert(contr.isLoggedIn());
//         contr.logout();
//         assert(!contr.isLoggedIn());
//         contr.logout();
//         assert(!contr.isLoggedIn());
//       }
//     });
//   });
// });



// describe('signup', function () {
//   describe('normal correct case →', function () {
//     it('is logged in + can login with username and password after signup and logging out', function () {
//       let contr = getContr();
//       for (let i = 0; i < MAX_CASES; i++) {
//         let username = "user " + i;
//         let password = "password " + i;
//         contr.signup(username, password);
//         assert(contr.isLoggedIn());
//         contr.logout();
//         assert(contr.login(username, password));
//       }
//     });
//   });
//   describe('username already exists → throw exc', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       let username = "user";
//       let password = "password";
//       contr.signup(username, password);
//       for (let i = 0; i < MAX_CASES; i++) {
//         password = "password " + i;
//         assert.throws(() => contr.signup(username, password), Error, 'Username already exists!');
//       }
//     });
//   });
//   describe('password < 8 chars → throw exc', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       let password = ""
//       for (let i = 0; i < MAX_PASS_LEN; i++) {
//         let username = "user " + i;
//         assert.throws(() => contr.signup(username, password), Error, 'Password must be at least 8 characters long.');
//         password += "a";
//       }
//       // NOW PASSWORD IS LENGTH 8 --> SHOULD WORK
//       for (let i = 0; i < MAX_PASS_LEN; i++) {
//         let username = "user " + i;
//         assert.doesNotThrow(() => contr.signup(username, password));
//         password += "a";
//       }
//     });
//   });
// });


////       FUNCTIONAL METHODS         ////
// describe('addFolder', function () {
//   describe('normal correct case → correct folder data', function () {
//     it('should have correct folder data', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       for (let i = 0; i < MAX_CASES; i++) {
//         let folderName = "name " + i;
//         let folder = new TaskFolder(folderName, "desc " + i, "eggType " + i)
//         contr.addFolder(folder.getName(), folder.getDescription(), folder.getEgg().getEggType());

//         // test here
//         let expected = folder.getJSON();
//         let actual = viewer.getTaskFolderInfo(user.getID(), folderName);
//         // console.log(actual);  // to see what data looks like
//         assert.strictEqual(expected, actual);
//       }
//     });
//   });
//   describe('folder already exists → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       let desc = "desc ";
//       let eggType = "eggType ";
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.doesNotThrow(() => contr.addFolder(folderName + i, desc + i, eggType + i));
//         assert.throws(() => contr.addFolder(folderName + i, desc + i, eggType + i), Error,
//                       'Duplicated value: the given folder name already exists');
//       }
//     });
//   });
// });


// describe('setFolder', function () {
//   describe('normal correct case → correct folder data', function () {
//     it('should have correct folder data && optional params undefined → same data', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "name ";
//       let desc = "desc ";
//       let eggType = "eggType ";
//       for (let i = 0; i < MAX_CASES; i++) {
//         contr.addFolder(folderName + i, desc, eggType);

                
//         let before = viewer.getTaskFolderInfo(user.getID(), folderName + i);
//         contr.setFolder(folderName + i);
//         let after = viewer.getTaskFolderInfo(user.getID(), folderName + i);
//         assert.strictEqual(before, after);

//         contr.setFolder(folderName + i, folderName + i + "k", desc + i);

//         let folder = new TaskFolder(folderName + i + "k", desc + i, eggType);
//         // test here
//         let expected = folder.getJSON();
//         let actual = viewer.getTaskFolderInfo(user.getID(), folderName + i + "k");
//         // console.log(actual);  // to see what data looks like
//         assert.strictEqual(expected, actual);
//       }
//     });
//   });
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       let desc = "desc ";
//       let eggType = "eggType ";
//       contr.addFolder(folderName, desc, eggType);
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.setFolder(folderName + i, folderName + i + "k", desc), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
//   describe('newName already exists —> exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       contr.addFolder("already exist", "desc", "eggType");
//       let folderName = "name ";
//       for (let i = 0; i < MAX_CASES; i++) {
//         // add folders so they can be set
//         contr.addFolder(folderName + i, "desc", "eggType");
//       }
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.setFolder(folderName + i, "already exist", "desc"), Error,
//                       'Duplicated value: the new folder name already exists');
//       }
//     });
//   });
// });


// describe('deleteFolder', function () {
//   describe('folder is correctly missing', function () {
//     it('should have correct folder data', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       for (let i = 0; i < MAX_CASES; i++) {
//         let folderName = "name " + i;
//         let folder = new TaskFolder(folderName, "desc " + i, "eggType " + i)
//         contr.addFolder(folder.getName(), folder.getDescription(), folder.getEgg().getEggType());
//         let actualBeforeDelete = viewer.getTaskFolderInfo(user.getID(), folderName);
//         contr.deleteFolder(folder.getName());

//         // test here
//         let actual = viewer.getTaskFolderInfo(user.getID(), folderName);
//         // console.log(actual);  // to see what data looks like
//         assert.strictEqual(folder.getJSON(), actualBeforeDelete);
//         assert.strictEqual("", actual);
//       }
//     });
//   });
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.deleteFolder(folderName + i), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
// });


// describe('addTask', function () {
//   describe('normal correct case → correct task data', function () {
//     it('should have correct task data', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "folderName";
//       contr.addFolder(folderName, "desc", "eggType");
//       for (let i = 0; i < MAX_CASES; i++) {
//         let taskID = contr.addTask(folderName, "task name " + i, "desc " + i, [], []);
//         let expectedTask = new Task(contr.getIDManager(), "task name " + i, "desc " + i, [], user.getID(), []);

//         // test here
//         let actualTask = JSON.parse(viewer.getTaskInfo(taskID));
//         assert.strictEqual(expectedTask.getName(), actualTask.name);
//         assert.strictEqual(expectedTask.getDescription(), actualTask.description);
//       }
//     });
//   });
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.addTask(folderName + i, "task name " + i, "desc " + i, [], []), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
// });


// describe('setTask', function () {
//   describe('normal correct case → correct task data', function () {
//     it('should have correct task data', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "folderName";
//       contr.addFolder(folderName, "desc", "eggType");
//       for (let i = 0; i < MAX_CASES; i++) {
//         let taskID = contr.addTask(folderName,            "task name " + i,       "desc " + i, [], []);
//         contr.setTask(folderName, taskID, false,          "task name " + i + "k", "desc " + i + "k");
//         let expectedTask = new Task(contr.getIDManager(), "task name " + i + "k", "desc " + i + "k", [], user.getID(), []);

//         // test here
//         let actualTask = JSON.parse(viewer.getTaskInfo(taskID));
//         assert.strictEqual(expectedTask.getName(), actualTask.name);
//         assert.strictEqual(expectedTask.getDescription(), actualTask.description);
//       }
//     });
//   });
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       contr.addFolder(folderName, "desc", "eggType");
//       let taskID = contr.addTask(folderName, "task name", "desc", [], []);
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.setTask(folderName + i, taskID, false, "task name", "desc", [], []), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
//   describe('taskID DNE IN FOLDER (not in general) —> exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let folderAAA = "folder AAA";
//       contr.addFolder(folderAAA, "desc", "eggType");
//       let taskIDs: Set<TaskID> = new Set<TaskID>();
//       for (let i = 0; i < MAX_CASES; i++) {
//         taskIDs.add(contr.addTask(folderAAA, "task name " + i, "desc " + i, [], []));
//       }
//       let folderBBB = "folder BBB";
//       contr.addFolder(folderBBB, "desc", "eggType");
//       taskIDs.forEach(taskID => {
//         // test here
//         assert.throws(() => contr.setTask(folderBBB, taskID, false, "task name", "desc", [], []), Error,
//                       'The taskID does not exist in this folder');
//       });
//     });
//   });
// });



// describe('deleteTask', function () {
//   describe('normal correct case → task is gone from folder and view', function () {
//     it('should have task gone from folder and view', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "folderName";
//       contr.addFolder(folderName, "desc", "eggType");
//       for (let i = 0; i < MAX_CASES; i++) {
//         let taskID = contr.addTask(folderName, "task name " + i, "desc " + i, [], []);
//         contr.deleteTask(folderName, taskID);
//         let expected = "";

//         // test here -- deleted from view
//         let actual = viewer.getTaskInfo(taskID);
//         assert.strictEqual(expected, actual);

//         // deleted from folder
//         let folder = user.getTaskFolders().get(folderName);
//         assert(folder !== undefined);
//         assert(folder.getTasks().get(taskID) === undefined)
//       }
//     });
//   });
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       contr.addFolder(folderName, "desc", "eggType");
//       let taskID = contr.addTask(folderName, "task name", "desc", [], []);
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.deleteTask(folderName + i, taskID), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
//   describe('taskID DNE IN FOLDER (not in general) —> exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let folderAAA = "folder AAA";
//       contr.addFolder(folderAAA, "desc", "eggType");
//       let taskIDs: Set<TaskID> = new Set<TaskID>();
//       for (let i = 0; i < MAX_CASES; i++) {
//         taskIDs.add(contr.addTask(folderAAA, "task name " + i, "desc " + i, [], []));
//       }
//       let folderBBB = "folder BBB";
//       contr.addFolder(folderBBB, "desc", "eggType");
//       taskIDs.forEach(taskID => {
//         // test here
//         assert.throws(() => contr.deleteTask(folderBBB, taskID), Error,
//                       'The taskID does not exist in this folder');
//       });
//     });
//   });
// });


// describe('addUnivCredits', function () {
//   describe('0 → adds 0 creds && 1 → adds 1 creds && 10000 → adds 10000 creds', function () {
//     it('should have correct num of univ credit', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       // 0 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         contr.addUnivCredits(0);
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
//       }
//       // 1 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         contr.addUnivCredits(1);
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits + 1, userAfter.univCredits);
//       }
//       // 10000 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         contr.addUnivCredits(10000);
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits + 10000, userAfter.univCredits);
//       }
//     });
//   });
//   describe('-1 → exception && -10000 → exception', function () {
//     it('should throw an error && num credits stays the same', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       // -1 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         assert.throws(() => contr.addUnivCredits(-1), Error, 'Illegal operation: negative credit value');
//       }
//       // -10000 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         assert.throws(() => contr.addUnivCredits(-1), Error, 'Illegal operation: negative credit value');
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
//       }
//     });
//   });
// });



// describe('removeUnivCredits', function () {
//   describe('0 → adds 0 creds && 1 → removes 1 creds && 10000 → removes 10000 creds', function () {
//     it('should have correct num of univ credit', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       // 0 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         contr.removeUnivCredits(0);
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
//       }
//       // 1 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         contr.removeUnivCredits(1);
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits - 1, userAfter.univCredits);
//       }
//       // 10000 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         contr.removeUnivCredits(10000);
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits - 10000, userAfter.univCredits);
//       }
//     });
//   });
//   describe('-1 → exception && -10000 → exception', function () {
//     it('should throw an error && num credits stays the same', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       // -1 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         assert.throws(() => contr.removeUnivCredits(-1), Error, 'Illegal operation: negative credit value');
//       }
//       // -10000 case
//       for (let i = 0; i < MAX_CASES; i++) {
//         let userBefore = JSON.parse(viewer.getUserInfo(user.getID()));
//         assert.throws(() => contr.removeUnivCredits(-1), Error, 'Illegal operation: negative credit value');
//         let userAfter = JSON.parse(viewer.getUserInfo(user.getID()));

//         assert.strictEqual(userBefore.univCredits, userAfter.univCredits);
//       }
//     });
//   });
// });




// describe('addEggCredits', function () {
//   describe('0 → adds 0 creds && 1 → adds 1 creds && 10000 → adds 10000 creds', function () {
//     it('should have correct num of univ credit', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "name";
//       contr.addFolder(folderName, "desc", "eggType")
//       function checker(num: number): void {
//         for (let i = 0; i < MAX_CASES; i++) {
//           let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
//           contr.addEggCredits(num, folderName);
//           let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
//           assert.strictEqual(folderBefore.eggCredits + num, folderAfter.eggCredits);
//         }
//       }
//       // cases 0, 1, 10000
//       checker(0);
//       checker(1);
//       checker(10000);
//     });
//   });
//   describe('-1 → exception && -10000 → exception', function () {
//     it('should throw an error && num credits stays the same', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "name";
//       contr.addFolder(folderName, "desc", "eggType")
//       function checker(num: number): void {
//         for (let i = 0; i < MAX_CASES; i++) {
//           let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
//           assert.throws(() => contr.addEggCredits(num, folderName), Error, 'Illegal operation: negative credit value');
//           let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
//           assert.strictEqual(folderBefore.eggCredits, folderAfter.eggCredits);
//         }
//       }
//       // -1, 10000 cases
//       checker(-1);
//       checker(-10000);
//     });
//   });
// });


// describe('removeEggCredits', function () {
//   describe('0 → adds 0 creds && 1 → removes 1 creds && 10000 → removes 10000 creds', function () {
//     it('should have correct num of univ credit', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "name";
//       contr.addFolder(folderName, "desc", "eggType")
//       function checker(num: number): void {
//         for (let i = 0; i < MAX_CASES; i++) {
//           let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
//           contr.removeEggCredits(num, folderName);
//           let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
//           assert.strictEqual(folderBefore.eggCredits - num, folderAfter.eggCredits);
//         }
//       }
//       // cases 0, 1, 10000
//       checker(0);
//       checker(1);
//       checker(10000);
//     });
//   });
//   describe('-1 → exception && -10000 → exception', function () {
//     it('should throw an error && num credits stays the same', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "name";
//       contr.addFolder(folderName, "desc", "eggType")
//       function checker(num: number): void {
//         for (let i = 0; i < MAX_CASES; i++) {
//           let folderBefore = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
//           assert.throws(() => contr.removeEggCredits(num, folderName), Error, 'Illegal operation: negative credit value');
//           let folderAfter = JSON.parse(viewer.getTaskFolderInfo(user.getID(), folderName));
  
//           assert.strictEqual(folderBefore.eggCredits, folderAfter.eggCredits);
//         }
//       }
//       // -1, 10000 cases
//       checker(-1);
//       checker(-10000);
//     });
//   });
// });




// describe('buyAccessory', function () {
//   /* for reference, types in EggManager are
  
//       makeAccessory(name: string): Accessory {
//         const acc: Accessory = {
//           name: name,
//           graphicLink: "",
//           cost: 100,
//         }
//       }

//       this.eggTypes.set("egg1", this.makeEggType("egg1"))
//       this.eggTypes.set("egg2", this.makeEggType("egg2"))

//       this.interactions.set("inter1", this.makeInteraction("inter1"))
//       this.interactions.set("inter2", this.makeInteraction("inter2"))

//       this.accessories.set("acc1", this.makeAccessory("acc1"))
//       this.accessories.set("acc2", this.makeAccessory("acc2"))
//     */
//   describe('normal case →', function () {
//     it('should have correct data shown for Acc && return true', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         contr.addUnivCredits(10000 * MAX_CASES);
//         for (let i = 0; i < MAX_CASES; i++) {
//           let ret = contr.buyAccessory(folderName, "acc1");
//           let folder = user.getTaskFolders().get(folderName);
//           assert(folder !== undefined);
//           let accs = folder.getEgg().getEquippedAccessories();  // should have exactly one acc
//           accs.forEach(function (accType) {
//             const accessory = contr.getEggManager().getAccessory(accType);
//             assert(accessory !== undefined);
//             assert.strictEqual(accessory.cost, 100);
//             assert.strictEqual(accessory.name, "acc1");
//             assert.strictEqual(accessory.graphicLink, "");
//           });
//           folder.getEgg().getEquippedAccessories().clear();
//           assert(ret);
//         }
//       }
//     });
//   });
//   // 'you already purchased this accessory'

//   describe('credit-check case when eggCredits >= cost', function () {
//     it('should spends egg-specific credits + return true', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         let eggCredits = 10000 * MAX_CASES;
//         contr.addEggCredits(eggCredits, folderName);
//         let folder = user.getTaskFolders().get(folderName);
//         assert(folder !== undefined);
//         for (let i = 0; i < MAX_CASES; i++) {
//           assert(contr.buyAccessory(folderName, "acc1"));
//           eggCredits -= 100;  // default accesory cost
//           assert.strictEqual(eggCredits, folder.getEggCredits());
//           folder.getEgg().getEquippedAccessories().clear();
//         }
//       }
//     });
//   });
//   describe('credit-check case when eggCredits < cost but can still afford', function () {
//     it('should return true && eggCredits == 0 && univCredits -= (cost - eggCredits)', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         let folder = user.getTaskFolders().get(folderName);
//         let univCredits = MAX_CASES * 100;
//         contr.addUnivCredits(univCredits);
//         assert(folder !== undefined);
//         for (let i = 0; i < MAX_CASES; i++) {
//           let eggCredits = 50 + (i % 17);
//           contr.addEggCredits(eggCredits, folderName);  // varying egg credits
//           assert(contr.buyAccessory(folderName, "acc1"));
//           univCredits -= (100 - eggCredits);
//           assert.strictEqual(0, folder.getEggCredits());
//           assert.strictEqual(univCredits, user.getUnivCredits());
//           folder.getEgg().getEquippedAccessories().clear();
//         }
//       }
//     });
//   });
//   describe('credit-check case when there are not enough credits', function () {
//     it('should return false and spend no credits', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         let folder = user.getTaskFolders().get(folderName);
//         assert(folder !== undefined);
//         for (let i = 0; i < MAX_CASES; i++) {
//           let eggCredits = 50 + (i % 17);
//           contr.addEggCredits(eggCredits, folderName);  // varying egg credits
//           assert(!contr.buyAccessory(folderName, "acc1"));  // assert we cannot buy
//           assert.strictEqual(eggCredits, folder.getEggCredits());
//           contr.removeEggCredits(eggCredits, folderName);
//         }
//       }
//     });
//   });
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       contr.addFolder(folderName, "desc", "egg1");
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.buyAccessory(folderName + i, "acc1"), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
//   describe('accessory/inter not allowed → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let folderName = "name ";
//       contr.addFolder(folderName, "desc", "egg1");
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.buyAccessory(folderName, "fakeAcc" + i), Error,
//                       'not allowed to buy this accessory');
//       }
//     });
//   });
// });




// describe('buyInteraction', function () {
//   /* for reference, types in EggManager are
  
//       makeInteraction(name: string): Interaction {
//         const inter: Interaction = {
//           name: name,
//           cost: 100,
//           expGained: 100,
//         }
//         return inter;
//       }

//       this.eggTypes.set("egg1", this.makeEggType("egg1"))
//       this.eggTypes.set("egg2", this.makeEggType("egg2"))

//       this.interactions.set("inter1", this.makeInteraction("inter1"))
//       this.interactions.set("inter2", this.makeInteraction("inter2"))

//       this.accessories.set("acc1", this.makeAccessory("acc1"))
//       this.accessories.set("acc2", this.makeAccessory("acc2"))
//     */
//   describe('normal case →', function () {
//     it('should have exp is correctly gained && return true', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         contr.addUnivCredits(10000 * MAX_CASES);
//         let folder = user.getTaskFolders().get(folderName);
//         assert(folder !== undefined);
//         let exp = folder.getEgg().getExp();
//         for (let i = 0; i < MAX_CASES; i++) {
//           assert(contr.buyInteraction(folderName, "inter1"));
//           exp += 100;  // default exp value
//           assert.strictEqual(exp, folder.getEgg().getExp());
//         }
//       }
//     });
//   });
//   // 'you already purchased this accessory'

//   describe('credit-check case when eggCredits >= cost', function () {
//     it('should spends egg-specific credits + return true', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         let eggCredits = 10000 * MAX_CASES;
//         contr.addEggCredits(eggCredits, folderName);
//         let folder = user.getTaskFolders().get(folderName);
//         assert(folder !== undefined);
//         for (let i = 0; i < MAX_CASES; i++) {
//           assert(contr.buyInteraction(folderName, "inter1"));
//           eggCredits -= 100;  // default accesory cost
//           assert.strictEqual(eggCredits, folder.getEggCredits());
//           folder.getEgg().getEquippedAccessories().clear();
//         }
//       }
//     });
//   });
//   describe('credit-check case when eggCredits < cost but can still afford', function () {
//     it('should return true && eggCredits == 0 && univCredits -= (cost - eggCredits)', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         let folder = user.getTaskFolders().get(folderName);
//         let univCredits = MAX_CASES * 100;
//         contr.addUnivCredits(univCredits);
//         assert(folder !== undefined);
//         for (let i = 0; i < MAX_CASES; i++) {
//           let eggCredits = 50 + (i % 17);
//           contr.addEggCredits(eggCredits, folderName);  // varying egg credits
//           assert(contr.buyInteraction(folderName, "inter1"));
//           univCredits -= (100 - eggCredits);
//           assert.strictEqual(0, folder.getEggCredits());
//           assert.strictEqual(univCredits, user.getUnivCredits());
//           folder.getEgg().getEquippedAccessories().clear();
//         }
//       }
//     });
//   });
//   describe('credit-check case when there are not enough credits', function () {
//     it('should return false and spend no credits', function () {
//       // can only test if DB is not there
//       let contr = getContr();
//       if (!contr.getEggManager().USE_DB) {
//         let user = getDefaultUser(contr);
//         let viewer = getViewer(contr);
//         let folderName = "name";
//         contr.addFolder(folderName, "desc", "egg1");
//         let folder = user.getTaskFolders().get(folderName);
//         assert(folder !== undefined);
//         for (let i = 0; i < MAX_CASES; i++) {
//           let eggCredits = 50 + (i % 17);
//           contr.addEggCredits(eggCredits, folderName);  // varying egg credits
//           assert(!contr.buyInteraction(folderName, "inter1"));  // assert we cannot buy
//           assert.strictEqual(eggCredits, folder.getEggCredits());
//           contr.removeEggCredits(eggCredits, folderName);
//         }
//       }
//     });
//   });
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       contr.addFolder(folderName, "desc", "egg1");
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.buyInteraction(folderName + i, "inter1"), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
//   describe('accessory/inter not allowed → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let folderName = "name ";
//       contr.addFolder(folderName, "desc", "egg1");
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.buyInteraction(folderName, "fakeInter" + i), Error,
//                       'not allowed to buy this interaction');
//       }
//     });
//   });
// });



// describe('gainExp', function () {
//   describe('folder DNE (does not exist) → exception', function () {
//     it('should throw an error', function () {
//       let contr = getContr();
//       getDefaultUser(contr);
//       let folderName = "name ";
//       contr.addFolder(folderName, "desc", "egg1");
//       for (let i = 0; i < MAX_CASES; i++) {
//         // test here
//         assert.throws(() => contr.gainExp(1000, folderName + i), Error,
//                       'The folder name does not exist');
//       }
//     });
//   });
//   describe('0 → adds 0 creds && 1 → adds 1 creds && 100 → adds 100 creds', function () {
//     // for reference, in EggManager; stages 1-5 are:
//     //    let bounds = [100, 200, 300, 400, 500];
//     it('should gain correct exp and correctly evolve (right stage)', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "name";
//       contr.addFolder(folderName, "desc", "egg1")
//       let folder = user.getTaskFolders().get(folderName);
//       assert(folder !== undefined);
//       let maxLevels = 5;
//       function checker(num: number, checkLevels: boolean, offByOne: boolean = false): void {
//         let exp = 0;
//         let firstTime = true;
//         if (offByOne) {
//           num -= 1;
//         }
//         for (let i = 0; i < maxLevels; i++) {
//           // exp check
//           contr.gainExp(num, folderName);
//           exp += num;
//           if (firstTime && offByOne) {
//             num += 1;
//             firstTime = false;  // want to add 99, then 100, then 100...exp
//           }
//           assert(folder !== undefined);
//           // console.log("expected exp: " + exp);
//           // console.log("actual exp: " + folder.getEgg().getExp());
//           assert.strictEqual(exp, folder.getEgg().getExp());

//           // stage check (can only be done if no DB is used)
//           if (checkLevels && !contr.getEggManager().USE_DB) {
//             let correctStage = i + 1;
//             if (offByOne) {
//               correctStage = i;
//             }
//             // console.log("expected stage: " + correctStage);
//             // console.log("actual stage: " + folder.getEgg().getEggStage());
//             assert.strictEqual(correctStage, folder.getEgg().getEggStage());
//             if (i === maxLevels - 1) {
//               checkLevels = false;
//             }
//           }
//         }
//         assert(folder !== undefined);
//         folder.getEgg().setExp(0);        // to reset data
//         folder.getEgg().setEggStage(0);   // to reset data
//       }
//       // cases 0, 1, 100
//       checker(0, false);
//       checker(1, false);
//       checker(100, true);
//       checker(100, true, true);  // off-by-one case
//     });
//   });
//   describe('-1 → exception && -10000 → exception', function () {
//     it('should throw an error && egg stays the same', function () {
//       let contr = getContr();
//       let user = getDefaultUser(contr);
//       let viewer = getViewer(contr);
//       let folderName = "name";
//       contr.addFolder(folderName, "desc", "eggType")
//       function checker(num: number): void {
//         for (let i = 0; i < MAX_CASES; i++) {
//           let eggBefore = viewer.getEggInfo(user.getID(), folderName);
//           assert.throws(() => contr.gainExp(num, folderName), Error, 'Illegal operation: negative credit value');
//           let eggAfter = viewer.getEggInfo(user.getID(), folderName);
  
//           assert.strictEqual(eggBefore, eggAfter);
//         }
//       }
//       // -1, 10000 cases
//       checker(-1);
//       checker(-10000);
//     });
//   });
// });