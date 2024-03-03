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
import { TaskID } from "../src/types/TaskID";
import { TaskFolder } from '../src/model/TaskFolder';
import { DateTime } from "../src/types/DateTime";
import { Duration } from "../src/types/Duration";
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
            const user = await idMan.getUserByID(userID);
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
            assert.strictEqual(res6.body, 'addFolder');
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
            assert.strictEqual(res8.body, 'setFolder');

            // Only newName
            const res9:Response = await request(app).post('/controller').send({func:'setFolder', name:'folderName1', newName:'newName'});
            assert.strictEqual(res9.statusCode, 200);
            assert.strictEqual(res9.body, 'setFolder');

            // Only newDesc
            const res10:Response = await request(app).post('/controller').send({func:'setFolder', name:'newName', description:'newDesc'});
            assert.strictEqual(res10.statusCode, 200);
            assert.strictEqual(res10.body, 'setFolder');

            // Both newName && newDesc
            const res11:Response = await request(app).post('/controller').send({func:'setFolder', name:'newName', newName:'folderName1', description:'desc1'});
            assert.strictEqual(res11.statusCode, 200);
            assert.strictEqual(res11.body, 'setFolder');
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
            assert.strictEqual(res5.body, 'deleteFolder');
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

        it('no task description case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The description is undefined or is not a string');
        });

        it('no task tag case', async() => {
            // no task tag case
            const res4:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1'});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The tags of the Task is not a string array');

            // tag not an array case
            const res5:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tag:5});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'The tags of the Task is not a string array');

            // tag not a string array case
            const res6:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tag:[1, 2, 3, 4, 5]});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The tags of the Task is not a string array');
        });

        it('no task whoSharedWith case', async() => {
            // no task whoSharedWith case
            const res7:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2']});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'The shared list is not a UserID');

            // tag not an array case
            const res8:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:5});
            assert.strictEqual(res8.statusCode, 400);
            assert.strictEqual(res8.body, 'The shared list is not a UserID');

            // tag not a UserID array case
            const res9:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:['who1', 'who2']});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The shared list is not a UserID');
        });

        const userID1:UserID = {id:'userID1'};
        const userID2:UserID = {id:'userID2'};
        const userIDArr = [userID1, userID2];
        it('wrong type of task startDate case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of the start Date is not a DateTime but is defined');
        });

        it('wrong type of task cycleDuration case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, cycleDuration:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of the cycle Duration is not a Duration but is defined');
        });

        it('wrong type of task deadline case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, deadline:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of the deadline is not a DateTime but is defined');
        });

        it('user not signed in case', async() => {
            const res10:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            assert.strictEqual(res10.statusCode, 400);
            assert.strictEqual(res10.body, 'Illegal operation: user is not signed-in!');
        });

        it('folder name doesn\'t exist case', async() => {
            contr.login("USER1", "CORRECTPW");
            const res11:Response = await request(app).post('/controller').send({func:'addTask', folderName:'CheckFolderName',  taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            assert.strictEqual(res11.statusCode, 400);
            assert.strictEqual(res11.body, 'The folder name does not exist');
        });

        it('correct case', async() => {
            // no optional case
            const res12:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            assert.strictEqual(res12.statusCode, 200);

            // startDate case
            const start:DateTime = {year:1, month:1, day:1, hour:1, minute:1}
            const res13:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName2', description:'desc2', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:start});
            assert.strictEqual(res13.statusCode, 200);

            // cycleDuration case
            const cycle:Duration = {weeks:2, days:2, hours:2}
            const res14:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName3', description:'desc3', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:start, cycleDuration:cycle});
            assert.strictEqual(res14.statusCode, 200);

            // deadline case
            const dead:DateTime = {year:3, month:3, day:3, hour:3, minute:3}
            const res15:Response = await request(app).post('/controller').send({func:'addTask', folderName:'folderName1', taskName:'taskName4', description:'desc4', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:start, cycleDuration:cycle, deadline:dead});
            assert.strictEqual(res15.statusCode, 200);
            contr.logout();
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // USER1-TaskFolder: folderName1
    //                  -Task1
    //                  -Task2
    //                  -Task3
    //                  -Task4
    describe('setTask', () => {
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'setTask'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('no Task id case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The id is undefined or is not a string');
        });

        const id:TaskID = {id:'taskID'};
        it('wrong type of isComplete case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, isComplete:5});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The type of isComplete is not a boolean but is defined');
        });

        it('wrong type of task name case', async() => {
            const res5:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, taskName:5});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'The type of taskName is not a string but is defined');
        });

        it('wrong type of task description case', async() => {
            const res6:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, description:5});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The type of description is not a string but is defined');
        });

        it('wrong type of tag case', async() => {
            const res7:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, tags:5});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'The type of tags is not a string array but is defined');
        });

        it('wrong type of whoSharedWith case', async() => {
            const res8:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, whoSharedWith:5});
            assert.strictEqual(res8.statusCode, 400);
            assert.strictEqual(res8.body, 'The type of shared list is not a string array but is defined');
        });

        it('wrong type of startDate case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, startDate:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of the start Date is not a DateTime but is defined');
        });

        it('wrong type of cycleDuration case', async() => {
            const res10:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, cycleDuration:5});
            assert.strictEqual(res10.statusCode, 400);
            assert.strictEqual(res10.body, 'The type of the cycle Duration is not a Duration but is defined');
        });

        it('wrong type of deadline case', async() => {
            const res11:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, deadline:5});
            assert.strictEqual(res11.statusCode, 400);
            assert.strictEqual(res11.body, 'The type of the deadline is not a DateTime but is defined');
        });

        it('user not signed in case', async() => {
            const res12:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1',  TaskID:id});
            assert.strictEqual(res12.statusCode, 400);
            assert.strictEqual(res12.body, 'Illegal operation: user is not signed-in!');
        });

        it('folder name doesn\'t exist case', async() => {
            contr.login("USER1", "CORRECTPW");
            const res13:Response = await request(app).post('/controller').send({func:'setTask', folderName:'CheckFolderName',  TaskID:id});
            assert.strictEqual(res13.statusCode, 400);
            assert.strictEqual(res13.body, 'The folder name does not exist');
        });

        it('taskID doesn\'t exist case', async() => {
            const wrongId:TaskID = {id:'wrong'};
            const res13:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1',  TaskID:wrongId});
            assert.strictEqual(res13.statusCode, 400);
            assert.strictEqual(res13.body, 'The taskID does not exist in this folder');
        });

        it('correct case', async() => {
            // const userID1:UserID = {id:'userid1'};
            // const userID2:UserID = {id:'userid2'};
            // const userIDArr = [userID1, userID2];
            // const start:DateTime = {year:1, month:1, day:1, hour:1, minute:1};
            // const cycle:Duration = {weeks:2, days:2, hours:2};
            // const dead:DateTime = {year:3, month:3, day:3, hour:3, minute:3};

            // const user = contr.getCurrentUser();
            // contr.addFolder("test", "test", "test");
            // const taskID = contr.addTask("test", "taskName1", "desc1", ["tag1", "tag2"], userIDArr, start, cycle, dead);
            // const tf = user?.getTaskFolders();
            // const actualTf = tf?.get("test");
            // const task = actualTf?.getTasks();
            // const actualTask = task?.get(taskID);
            // //assert.strictEqual(actualTask, undefined);
            // // no optional case
            // const res14:Response = await request(app).post('/controller').send({func:'setTask', folderName:'test', TaskID:taskID});
            // assert.strictEqual(res14.statusCode, 400);
            // assert.strictEqual("", res14.body);

            // isComplete case
            // const start:DateTime = {year:1, month:1, day:1, hour:1, minute:1}
            // const res13:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:task1, isComplete:true});
            // assert.strictEqual(res13.statusCode, 200);
            // task1 = res13.body;

            // cycleDuration case
            // const cycle:Duration = {weeks:2, days:2, hours:2}
            // const res14:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, deadline:5});
            // assert.strictEqual(res14.statusCode, 200);
            // assert.strictEqual(res14.text, 'setTask');

            // // deadline case
            // const dead:DateTime = {year:3, month:3, day:3, hour:3, minute:3}
            // const res15:Response = await request(app).post('/controller').send({func:'setTask', folderName:'folderName1', TaskID:id, deadline:5});
            // assert.strictEqual(res15.statusCode, 200);
            // assert.strictEqual(res15.text, 'setTask');
            contr.logout();
        });
    });
});


