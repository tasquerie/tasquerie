//TODO: delete the imports that are not used
import app from '../src/server/index';
import request from 'supertest';
import {Response} from 'supertest';
import { strict as assert } from 'assert';
import { UserID } from "../src/types/UserID";
import { TaskID } from "../src/types/TaskID";
import {getIDMan, getContr, getViewer} from '../src/server/index';

//TODO: make sure the returns are either a json or a string
//       clear it up so that it could be discussed in the meeting
// supertest:
// res.json(): res.body()
// res.send(): res.body for strings
const contr = getContr();

function loginUser() {
    contr.login("USERNAME", "PASSWORD");
    assert.strictEqual(contr.isLoggedIn(), true);
}

function logoutUser() {
    contr.logout();
    assert.strictEqual(contr.isLoggedIn(), false);
}

function getUserID(): UserID {
    const user = contr.getCurrentUser();
    const id = user?.getID();
    if (id === undefined) {
        throw new Error('userid is undefined');
    }
    return id;
}

// Check: Don't need login
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
            const user = contr.getCurrentUser();
            const checkID = user?.getID().id;
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, checkID);
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
            const res4:Response = await request(app).post('/login').send({func:'login', username:'USERNAME', password:'WRONG'});
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, '');
        });

        it('correct login', async() => {
            const res5:Response = await request(app).post('/login').send({func:'login', username:'USERNAME', password:'PASSWORD'});
            assert.strictEqual(res5.statusCode, 200);
            // assert.strictEqual(res5.body, 'true');
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              
    // User login: USER1

    describe('logout', () => {
        it('logout', async() => {
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
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addFolder'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addFolder', UserID: tempID});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('no description case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'addFolder', UserID: tempID, name:'FolderName'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The description of the folder is undefined or is not a string');
        });

        it('no eggType case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'addFolder', UserID: tempID, name:'FolderName', description:'Description'});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The egg type of the folder is undefined or is not a string');
        });

        it('user not signed in case', async() => {
            const res5:Response = await request(app).post('/controller').send({func:'addFolder', UserID: tempID, name:'FolderName', description:'Description', eggType:'EggType'});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: user is not signed-in!');
        });

        it('correct case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res6:Response = await request(app).post('/controller').send({func:'addFolder', UserID: userID, name:'folderName1', description:'desc1', eggType:'egg1'});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'addFolder');
        });

        it('existing folders', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res7:Response = await request(app).post('/controller').send({func:'addFolder', UserID: userID, name:'folderName1', description:'desc2', eggType:'eggType2'});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'Duplicated value: the given folder name already exists');
            logoutUser();
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // USER1-TaskFolder: folderName1

    describe('setFolder', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'setFolder'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'setFolder', UserID: tempID});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('new name != (undefined && string) case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'setFolder', UserID: tempID, name:'FolderName', newName:5});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The type of the new name is not a string but is defined');
        });

        it('description != (undefined && string) case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'setFolder', UserID: tempID, name:'FolderName', description:5});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The type of the description is not a string but is defined');
        });

        it('user not signed in case', async() => {
            const res5:Response = await request(app).post('/controller').send({func:'setFolder', UserID: tempID, name:'FolderName', description:'new Desc'});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: user is not signed-in!');
        });

        it('folder name doesn\'t exist case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res6:Response = await request(app).post('/controller').send({func:'setFolder', UserID: userID, name:'CheckFolderName', description:'new Desc'});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });

        it('correct case', async() => {
            // No newName && newDesc
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            await request(app).post('/controller').send({func:'addFolder', UserID: userID, name:'tempFolder', description:'desc2', eggType:'eggType2'});
            const res8:Response = await request(app).post('/controller').send({func:'setFolder', UserID: userID, name:'tempFolder'});
            assert.strictEqual(res8.statusCode, 200);
            assert.strictEqual(res8.body, 'setFolder');

            // Only newName
            const res9:Response = await request(app).post('/controller').send({func:'setFolder', UserID: userID, name:'tempFolder', newName:'newNameFolder'});
            assert.strictEqual(res9.statusCode, 200);
            assert.strictEqual(res9.body, 'setFolder');

            // Only newDesc
            const res10:Response = await request(app).post('/controller').send({func:'setFolder', UserID: userID, name:'newNameFolder', description:'newDesc'});
            assert.strictEqual(res10.statusCode, 200);
            assert.strictEqual(res10.body, 'setFolder');

            // Both newName && newDesc
            const res11:Response = await request(app).post('/controller').send({func:'setFolder', UserID: userID, name:'newNameFolder', newName:'tempFolder', description:'desc2'});
            assert.strictEqual(res11.statusCode, 200);
            assert.strictEqual(res11.body, 'setFolder');
        });

        it('existing folder with newName case', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            if (userID === undefined) {
                throw new Error('userID is undefined');
            }
            const res7:Response = await request(app).post('/controller').send({func:'setFolder', UserID: userID, name:'folderName1', newName:'tempFolder'});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'Duplicated value: the new folder name already exists');
            logoutUser();
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // USER1-TaskFolder: folderName1
    describe('deleteFolder', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'deleteFolder'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'deleteFolder', UserID:tempID});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('user not signed in case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'deleteFolder', UserID:tempID, name:'folderName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'Illegal operation: user is not signed-in!');
        });

        it('folder name doesn\'t exist case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res4:Response = await request(app).post('/controller').send({func:'deleteFolder', UserID:userID, name:'CheckFolderName'});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The folder name does not exist');
        });

        it('correct case', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res5:Response = await request(app).post('/controller').send({func:'deleteFolder', UserID:userID, name:'tempFolder'});
            assert.strictEqual(res5.statusCode, 200);
            assert.strictEqual(res5.body, 'deleteFolder');
            logoutUser();
        });
    });
    // Current Contr State:
    // User signup: 1. USERNAME | PASSWORD
    //              2. USER1 | CORRECTPW
    // USER1-TaskFolder: folderName1
    describe('addTask', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addTask'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folder name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the folder is undefined or is not a string');
        });

        it('no task name case', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addTask',  UserID:tempID, folderName:'folderName1'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'The name of the task is undefined or is not a string');
        });

        it('no task description case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The description is undefined or is not a string');
        });

        it('no task tag case', async() => {
            // no task tag case
            const res4:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1'});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The tags of the Task is not a string array');

            // tag not an array case
            const res5:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tag:5});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'The tags of the Task is not a string array');

            // tag not a string array case
            const res6:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tag:[1, 2, 3, 4, 5]});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The tags of the Task is not a string array');
        });

        it('no task whoSharedWith case', async() => {
            // no task whoSharedWith case
            const res7:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2']});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'The shared list is not a UserID');

            // tag not an array case
            const res8:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:5});
            assert.strictEqual(res8.statusCode, 400);
            assert.strictEqual(res8.body, 'The shared list is not a UserID');

            // tag not a UserID array case
            const res9:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:['who1', 'who2']});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The shared list is not a UserID');
        });

        const userID1:UserID = {id:'userID1'};
        const userID2:UserID = {id:'userID2'};
        const userIDArr = [userID1, userID2];
        it('wrong type of task startDate case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of startDate is not a string but is defined');
        });

        it('wrong type of task cycleDuration case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, cycleDuration:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of cycleDuration is not a string but is defined');
        });

        it('wrong type of task deadline case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, deadline:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of deadline is not a string but is defined');
        });

        it('user not signed in case', async() => {
            const res10:Response = await request(app).post('/controller').send({func:'addTask', UserID:tempID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            assert.strictEqual(res10.statusCode, 400);
            assert.strictEqual(res10.body, 'Illegal operation: user is not signed-in!');
        });

        it('folder name doesn\'t exist case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res11:Response = await request(app).post('/controller').send({func:'addTask', UserID:userID, folderName:'CheckFolderName',  taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            assert.strictEqual(res11.statusCode, 400);
            assert.strictEqual(res11.body, 'The folder name does not exist');
        });

        it('correct case', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            // no optional case
            const res12:Response = await request(app).post('/controller').send({func:'addTask', UserID:userID, folderName:'folderName1', taskName:'taskName1', description:'desc1', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            assert.strictEqual(res12.statusCode, 200);

            // startDate case
            const res13:Response = await request(app).post('/controller').send({func:'addTask', UserID:userID, folderName:'folderName1', taskName:'taskName2', description:'desc2', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:'start'});
            assert.strictEqual(res13.statusCode, 200);

            // cycleDuration case
            const res14:Response = await request(app).post('/controller').send({func:'addTask', UserID:userID, folderName:'folderName1', taskName:'taskName3', description:'desc3', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:'start', cycleDuration:'cycle'});
            assert.strictEqual(res14.statusCode, 200);

            // deadline case
            const res15:Response = await request(app).post('/controller').send({func:'addTask', UserID:userID, folderName:'folderName1', taskName:'taskName4', description:'desc4', tags:['tag1', 'tag2'], whoSharedWith:userIDArr, startDate:'start', cycleDuration:'cycle', deadline:'dead'});
            assert.strictEqual(res15.statusCode, 200);
            logoutUser();
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
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'setTask'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};

        it('no Task id case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The id is undefined or is not a string');
        });

        const id:TaskID = {id:'taskID'};
        it('wrong type of isComplete case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, isComplete:5});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The type of isComplete is not a boolean but is defined');
        });

        it('wrong type of task name case', async() => {
            const res5:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, taskName:5});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'The type of taskName is not a string but is defined');
        });

        it('wrong type of task description case', async() => {
            const res6:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, description:5});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The type of description is not a string but is defined');
        });

        it('wrong type of tag case', async() => {
            const res7:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, tags:5});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'The type of tags is not a string array but is defined');
        });

        it('wrong type of whoSharedWith case', async() => {
            const res8:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, whoSharedWith:5});
            assert.strictEqual(res8.statusCode, 400);
            assert.strictEqual(res8.body, 'The type of shared list is not a string array but is defined');
        });

        it('wrong type of startDate case', async() => {
            const res9:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, startDate:5});
            assert.strictEqual(res9.statusCode, 400);
            assert.strictEqual(res9.body, 'The type of startDate is not a string but is defined');
        });

        it('wrong type of cycleDuration case', async() => {
            const res10:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, cycleDuration:5});
            assert.strictEqual(res10.statusCode, 400);
            assert.strictEqual(res10.body, 'The type of cycleDuration is not a string but is defined');
        });

        it('wrong type of deadline case', async() => {
            const res11:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id, deadline:5});
            assert.strictEqual(res11.statusCode, 400);
            assert.strictEqual(res11.body, 'The type of deadline is not a string but is defined');
        });

        it('user not signed in case', async() => {
            const res12:Response = await request(app).post('/controller').send({func:'setTask', UserID:tempID, TaskID:id});
            assert.strictEqual(res12.statusCode, 400);
            assert.strictEqual(res12.body, 'Illegal operation: user is not signed-in!');
        });

        it('taskID doesn\'t exist case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const wrongId:TaskID = {id:'wrong'};
            const res13:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:wrongId});
            assert.strictEqual(res13.statusCode, 400);
            assert.strictEqual(res13.body, 'The taskID does not exist');
        });

        it('correct case', async() => {
            const userID1:UserID = {id:'userid1'};
            const userID2:UserID = {id:'userid2'};
            const userIDArr = [userID1, userID2];

            const user = contr.getCurrentUser();
            const userID = user?.getID();
            if (userID === undefined) {
                throw new Error('userID is undefined');
            }
            const res12:Response = await request(app).post('/controller').send({func:'addTask', UserID:userID, folderName:'folderName1', taskName:'taskName5', description:'desc5', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            const taskID = res12.body;
            // no optional case
            const res13:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID});
            assert.strictEqual(res13.statusCode, 200);
            assert.strictEqual(res13.body, "setTask");

            // isComplete case
            const res14:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, isComplete:true});
            assert.strictEqual(res14.statusCode, 200);
            assert.strictEqual(res14.body, "setTask");

            // taskName case
            const res15:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, taskName:"task2"});
            assert.strictEqual(res15.statusCode, 200);
            assert.strictEqual(res15.body, "setTask");

            // description case
            const res16:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, description:"desc2"});
            assert.strictEqual(res16.statusCode, 200);
            assert.strictEqual(res16.body, "setTask");

            // tags case
            const res17:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, tags:["changedtags1", "changedtags2"]});
            assert.strictEqual(res17.statusCode, 200);
            assert.strictEqual(res17.body, "setTask");

            // whoSharedWith case
            const changedID1:UserID = {id:'changedid1'};
            const changedID2:UserID = {id:'changedid2'};
            const changedIDArr = [changedID1, changedID2];
            const res18:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, whoSharedWith:changedIDArr});
            assert.strictEqual(res18.statusCode, 200);
            assert.strictEqual(res18.body, "setTask");

            // startDate case
            const res19:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, startDate:"startDate2"});
            assert.strictEqual(res19.statusCode, 200);
            assert.strictEqual(res19.body, "setTask");

            // cycleDuration case
            const res20:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, cycleDuration:"cycleDuration2"});
            assert.strictEqual(res20.statusCode, 200);
            assert.strictEqual(res20.body, "setTask");

            // deadline case
            const res21:Response = await request(app).post('/controller').send({func:'setTask', UserID:userID, TaskID:taskID, deadline:"deadline2"});
            assert.strictEqual(res21.statusCode, 200);
            assert.strictEqual(res21.body, "setTask");
            logoutUser();
        });
    });
    describe('deleteTask', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'deleteTask'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folderName case', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'deleteTask', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });

        it('no Task id case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'deleteTask', UserID:tempID, folderName:"folderName1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'The id is undefined or is not a string');
        });
        const id:TaskID = {id:'taskID'};
        it('user not signed in case', async() => {
            const res5:Response = await request(app).post('/controller').send({func:'deleteTask', UserID:tempID, folderName:"folderName1", TaskID:id});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: user is not signed-in!');
        });

        it('folderName doesn\'t exist case', async() => {
            loginUser();
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'deleteTask', UserID:userID, folderName:"wrongFolder", TaskID:id});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });

        it('taskID doesn\'t exist case', async() => {
            const userID = getUserID();
            const res7:Response = await request(app).post('/controller').send({func:'deleteTask', UserID:userID, folderName:"folderName1", TaskID:id});
            assert.strictEqual(res7.statusCode, 400);
            assert.strictEqual(res7.body, 'The taskID does not exist in this folder');
        });

        it('correct case', async() => {
            loginUser();
            const userID1:UserID = {id:'userid1'};
            const userID2:UserID = {id:'userid2'};
            const userIDArr = [userID1, userID2];

            let user = contr.getCurrentUser();
            const userID = user?.getID();
            if (userID === undefined) {
                throw new Error('userID is undefined');
            }
            const res12:Response = await request(app).post('/controller').send({func:'addTask', UserID:userID, folderName:'folderName1', taskName:'taskName6', description:'desc6', tags:['tag1', 'tag2'], whoSharedWith:userIDArr});
            const taskID = res12.body;
            //assert.strictEqual(taskID, "string");
            // TODO: Discuss about changing the TaskFolder field: taskIDtoTasks to Map<string, Task>
            //      and uncomment
            //const res8:Response = await request(app).post('/controller').send({func:'deleteTask', UserID:userID, folderName:"folderName1", TaskID:taskID});
            // assert.strictEqual(res8.statuscode, 200);
            // assert.strictEqual(res8.body, "deleteTask");
        });
    });
    describe('addUnivCredits', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addUnivCredits'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no amount', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'addUnivCredits', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The amount is undefined or is not a number');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'addUnivCredits', UserID:tempID, amount:10});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('negative credit case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res5:Response = await request(app).post('/controller').send({func:'addUnivCredits', UserID:userID, amount:-10});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: negative credit value');
        });
        it('correct case', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const beforeCred = user?.getUnivCredits();
            if (beforeCred === undefined) {
                throw new Error('UnivCredit is undefined');
            }
            const res6:Response = await request(app).post('/controller').send({func:'addUnivCredits', UserID:userID, amount:10});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'addUnivCredits');
            assert.strictEqual(beforeCred + 10, user?.getUnivCredits());
            logoutUser();
        });
    });
    describe('removeUnivCredits', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'removeUnivCredits'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no amount', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'removeUnivCredits', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The amount is undefined or is not a number');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'removeUnivCredits', UserID:tempID, amount:10});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('negative credit case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res5:Response = await request(app).post('/controller').send({func:'removeUnivCredits', UserID:userID, amount:-10});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: negative credit value');
        });
        //CHECK: Shouldn't we consider the case when UnivCredit goes to negative?
        it('correct case', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const beforeCred = user?.getUnivCredits();
            if (beforeCred === undefined) {
                throw new Error('UnivCredit is undefined');
            }
            const res6:Response = await request(app).post('/controller').send({func:'removeUnivCredits', UserID:userID, amount:5});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'removeUnivCredits');
            assert.strictEqual(beforeCred - 5, user?.getUnivCredits());
            logoutUser();
        });
    });
    describe('addEggCredits', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'addEggCredits'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no amount', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'addEggCredits', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The amount is undefined or is not a number');
        });
        it('no folderName', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'addEggCredits', UserID:tempID, amount:10});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'addEggCredits', UserID:tempID, amount:10, folderName:"folderName1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('negative credit case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res5:Response = await request(app).post('/controller').send({func:'addEggCredits', UserID:userID, amount:-10, folderName:"folderName1"});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: negative credit value');
        });
        it('folderName doesn\'t exist case', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res6:Response = await request(app).post('/controller').send({func:'addEggCredits', UserID:userID, amount:10, folderName:"wrongFolder"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });

        it('correct case', async() => {
            const userID = getUserID();
            const folder = contr.getCurrentUser()?.getTaskFolders().get("folderName1")
            const beforeCred = folder?.getEggCredits();
            if (beforeCred === undefined) {
                throw new Error('UnivCredit is undefined');
            }
            const res6:Response = await request(app).post('/controller').send({func:'addEggCredits', UserID:userID, amount:10, folderName:"folderName1"});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'addEggCredits');
            assert.strictEqual(beforeCred + 10, folder?.getEggCredits());
            logoutUser();
        });
    });
    describe('removeEggCredits', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'removeEggCredits'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no amount', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'removeEggCredits', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The amount is undefined or is not a number');
        });
        it('no folderName', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'removeEggCredits', UserID:tempID, amount:10});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'removeEggCredits', UserID:tempID, amount:10, folderName:"folderName1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('negative credit case', async() => {
            loginUser();
            const userID = getUserID();
            const res5:Response = await request(app).post('/controller').send({func:'removeEggCredits', UserID:userID, amount:-10, folderName:"folderName1"});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: negative credit value');
        });
        it('folderName doesn\'t exist case', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'removeEggCredits', UserID:userID, amount:10, folderName:"wrongFolder"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });
        //CHECK: Shouldn't we consider the case when EggCredits goes to negative?
        it('correct case', async() => {
            const userID = getUserID();
            const folder = contr.getCurrentUser()?.getTaskFolders().get("folderName1")
            const beforeCred = folder?.getEggCredits();
            if (beforeCred === undefined) {
                throw new Error('UnivCredit is undefined');
            }
            const res6:Response = await request(app).post('/controller').send({func:'removeEggCredits', UserID:userID, amount:5, folderName:"folderName1"});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'removeEggCredits');
            assert.strictEqual(beforeCred - 5, folder?.getEggCredits());
            logoutUser();
        });
    });
    describe('buyAccessory', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'buyAccessory'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folderName', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });
        it('no accessoryType', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:tempID, folderName:'folderName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The type of the accessory is undefined or is not a string');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:tempID, folderName:"folderName1", accessoryType:"accessType1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('folderName doesn\'t exist case', async() => {
            loginUser();
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:userID, folderName:"wrongFolder", accessoryType:"accessType1"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });
        it('undefined eggType', async() => {
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            if (userID === undefined) {
                throw new Error('userId is undefined');
            }
            await contr.addFolder(userID, "folderName2", "desc2", "eggType");
            const res6:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:userID, folderName:"folderName2", accessoryType:"accessType1"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'Impossible: undefined eggType');
        });
        it('not allowed accessory', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:userID, folderName:"folderName1", accessoryType:"acc3"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'not allowed to buy this accessory');
        });
        it('emtpy case', async() => {
        const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:userID, folderName:"folderName1", accessoryType:'acc1'});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'false');
        });
        it('correct case', async() => {
            const userID = getUserID();
            const folder = contr.getCurrentUser()?.getTaskFolders().get("folderName1");
            if (userID === undefined) {
                throw new Error('userID is undefined');
            }
            await contr.addEggCredits(userID, 100, "folderName1");
            const res6:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:userID, folderName:"folderName1", accessoryType:'acc1'});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'true');
            assert.strictEqual(folder?.getEggCredits(), 5);
        });
        it('already puchased', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyAccessory', UserID:userID, folderName:"folderName1", accessoryType:'acc1'});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'you already purchased this accessory');
        });
    });
    describe('buyInteraction', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'buyInteraction'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folderName', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });
        it('no interactionType', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:tempID, folderName:'folderName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The type of the interaction is undefined or is not a string');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:tempID, folderName:"folderName1", interactionType:"accessType1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('folderName doesn\'t exist case', async() => {
            loginUser();
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:userID, folderName:"wrongFolder", interactionType:"accessType1"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });
        it('undefined eggType', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:userID, folderName:"folderName2", interactionType:"interType1"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'Impossible: undefined eggType');
        });
        it('not allowed interaction', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:userID, folderName:"folderName1", interactionType:"inter3"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'not allowed to buy this interaction');
        });
        it('not enough credits', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:userID, folderName:"folderName1", interactionType:'inter1'});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'false');
        });
        it('correct case', async() => {
            const userID = getUserID();
            const folder = contr.getCurrentUser()?.getTaskFolders().get("folderName1");
            if (userID === undefined) {
                throw new Error('userID is undefined');
            }
            await contr.addEggCredits(userID, 100, "folderName1");
            const res6:Response = await request(app).post('/controller').send({func:'buyInteraction', UserID:userID, folderName:"folderName1", interactionType:'inter1'});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'true');
            assert.strictEqual(folder?.getEggCredits(), 5);
        });
    });
    describe('gainExp', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'gainExp'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no amount', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'gainExp', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The amount is undefined or is not a number');
        });
        it('no folderName', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'gainExp', UserID:tempID, amount:10});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'gainExp', UserID:tempID, amount:10, folderName:"folderName1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('negative credit case', async() => {
            loginUser();
            const userID = getUserID();
            const res5:Response = await request(app).post('/controller').send({func:'gainExp', UserID:userID, amount:-10, folderName:"folderName1"});
            assert.strictEqual(res5.statusCode, 400);
            assert.strictEqual(res5.body, 'Illegal operation: negative credit value');
        });
        it('folderName doesn\'t exist case', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'gainExp', UserID:userID, amount:10, folderName:"wrongFolder"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });
        it('undefined eggType', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'gainExp', UserID:userID, amount:10, folderName:"folderName2"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'Impossible: undefined eggType');
        });
        it('correct case', async() => {
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'gainExp', UserID:userID, amount:10, folderName:"folderName1"});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'gainExp');
        });
    });
    describe('equipAccessory', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'equipAccessory'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folderName', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'equipAccessory', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });
        it('no accessory', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'equipAccessory', UserID:tempID, folderName:'folderName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The accessory is undefined or is not a string');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'equipAccessory', UserID:tempID, folderName:"folderName1", accessory:"accessType1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('folderName doesn\'t exist case', async() => {
            loginUser();
            const userID = getUserID();
            const res6:Response = await request(app).post('/controller').send({func:'equipAccessory', UserID:userID, folderName:"wrongFolder", accessory:"accessType1"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });
        it('correct case', async() => {
            const userID = getUserID();
            const folder = contr.getCurrentUser()?.getTaskFolders().get('folderName1');
            // CHECK: Do we need to know if the equip actually worked? Returning boolean
            //Not owned
            const res6:Response = await request(app).post('/controller').send({func:'equipAccessory', UserID:userID, folderName:"folderName1", accessory:"acc2"});
            assert.strictEqual(res6.statusCode, 200);
            //assert.strictEqual(res6.body, 'false');
            //Owned
            if (userID === undefined) {
                throw new Error('userID is undefined');
            }
            await contr.addEggCredits(userID, 100, "folderName1");
            await contr.buyAccessory(userID, "folderName1", "acc2");
            const res8:Response = await request(app).post('/controller').send({func:'equipAccessory', UserID:userID, folderName:"folderName1", accessory:"acc2"});
            assert.strictEqual(res8.statusCode, 200);
            //assert.strictEqual(res8.body, 'true')
        });
    });
    describe('unequipAccessory', () => {
        it('no user ID', async() => {
            const res2:Response = await request(app).post('/controller').send({func:'unequipAccessory'});
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'Wrong type for User ID');
        });
        const tempID:UserID = {id:"id"};
        it('no folderName', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'unequipAccessory', UserID:tempID});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The name of the folder is undefined or is not a string');
        });
        it('no accessory', async() => {
            const res3:Response = await request(app).post('/controller').send({func:'unequipAccessory', UserID:tempID, folderName:'folderName1'});
            assert.strictEqual(res3.statusCode, 400);
            assert.strictEqual(res3.body, 'The accessory is undefined or is not a string');
        });
        it('user not signed in case', async() => {
            const res4:Response = await request(app).post('/controller').send({func:'unequipAccessory', UserID:tempID, folderName:"folderName1", accessory:"accessType1"});
            assert.strictEqual(res4.statusCode, 400);
            assert.strictEqual(res4.body, 'Illegal operation: user is not signed-in!');
        });
        it('folderName doesn\'t exist case', async() => {
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            const res6:Response = await request(app).post('/controller').send({func:'unequipAccessory', UserID:userID, folderName:"wrongFolder", accessory:"accessType1"});
            assert.strictEqual(res6.statusCode, 400);
            assert.strictEqual(res6.body, 'The folder name does not exist');
        });
        it('correct case', async() => {
            const userID = getUserID();
            const folder = contr.getCurrentUser()?.getTaskFolders().get('folderName1');
            const res6:Response = await request(app).post('/controller').send({func:'unequipAccessory', UserID:userID, folderName:"folderName1", accessory:"acc2"});
            assert.strictEqual(res6.statusCode, 200);
            assert.strictEqual(res6.body, 'unequipAccessory');
        });
    });
});
describe('Route /view', () => {
    it('no function case', async() => {
        const res1:Response = await request(app).get('/view');
        assert.strictEqual(res1.statusCode, 400);
        assert.strictEqual(res1.body, 'The function of the request is not defined');
    });
    describe('getUserInfo', () => {
        it('no user id', async() => {
            const res2:Response = await request(app).get('/view?func=getUserInfo');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'UserID is not defined or is not a string');
        });
        it('empty string', async () => {
            const str = "id";
            const res3:Response = await request(app).get('/view?func=getUserInfo&UserID=' + "id");
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            loginUser();
            const userID = getUserID();
            const res4:Response = await request(app).get('/view?func=getUserInfo&UserID=' + userID.id);
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, contr.getCurrentUser()?.getJSON());
            logoutUser();
        });
    });
    describe('getTaskInfo', () => {
        it('no user id', async() => {
            const res2:Response = await request(app).get('/view?func=getTaskInfo');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'UserID is not defined or is not a string');
        });
        it('no task id', async() => {
            const res2:Response = await request(app).get('/view?func=getTaskInfo&UserID=' + 5);
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'TaskID is not defined or is not a string');
        });
        it('empty string', async () => {
            const str = "id";
            const res3:Response = await request(app).get('/view?func=getTaskInfo&UserID=' + 5 + '&TaskID=' + 5);
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            const whoId1:UserID = {id:'changedid1'};
            const whoID2:UserID = {id:'changedid2'};
            const whoIDArr = [whoId1, whoID2];

            loginUser();
            const userID = getUserID();
            const taskID = await contr.addTask(userID, "folderName1", "tempTask", "tempDesc", ['tag1', 'tag2'], whoIDArr);
            const task = contr.getCurrentUser()?.getTaskFolders().get('folderName1')?.getTasks().get(taskID);
            const res4:Response = await request(app).get('/view?func=getTaskInfo&UserID=' + userID.id + '&TaskID=' + taskID.id);
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, task?.getJSON());
            logoutUser();
        });
    });
    describe('getTaskFolderInfo', () => {
        it('no user id', async() => {
            const res2:Response = await request(app).get('/view?func=getTaskFolderInfo');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'UserID is not defined or is not a string');
        });
        it('no folderName', async() => {
            const res2:Response = await request(app).get('/view?func=getTaskFolderInfo&UserID=id');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'folderName is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getTaskFolderInfo&UserID=' + 5 + '&folderName=folderName1');
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");

            // taskFolder = undefined
            loginUser();
            const user = contr.getCurrentUser();
            const userID = user?.getID();
            if (userID === undefined) {
                throw new Error('userID is undefined');
            }
            const res4:Response = await request(app).get('/view?func=getTaskFolderInfo&UserID=' + userID.id + '&folderName=WrongName');
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, "");
        });
        it('correct case', async() => {
            const userID = getUserID();
            const folder = contr.getCurrentUser()?.getTaskFolders().get("folderName1");
            const res4:Response = await request(app).get('/view?func=getTaskFolderInfo&UserID=' + userID.id + '&folderName=folderName1');
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, folder?.getJSON());
            logoutUser();
        });
    });
    describe('getEggInfo', () => {
        it('no user id', async() => {
            const res2:Response = await request(app).get('/view?func=getEggInfo');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'UserID is not defined or is not a string');
        });
        it('no folderName', async() => {
            const res2:Response = await request(app).get('/view?func=getEggInfo&UserID=id');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'folderName is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getEggInfo&UserID=' + 5 + '&folderName=folderName1');
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");

            // taskFolder = undefined
            loginUser();
            const userID = getUserID();
            const res4:Response = await request(app).get('/view?func=getEggInfo&UserID=' +  userID.id + '&folderName=' + 5);
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, "");
        });
        it('correct case', async() => {
            const userID = getUserID();
            const egg = contr.getCurrentUser()?.getTaskFolders().get("folderName1")?.getEgg();
            const res4:Response = await request(app).get('/view?func=getEggInfo&UserID=' + userID.id + '&folderName=folderName1');
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, egg?.getJSON());
            logoutUser();
        });
    });
    describe('getEggType', () => {
        it('no name', async() => {
            const res2:Response = await request(app).get('/view?func=getEggType');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'name is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getEggType&name=id');
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            loginUser();
            const userID = getUserID()
            const eggTypeName = contr.getCurrentUser()?.getTaskFolders().get("folderName1")?.getEgg().getEggType();
            if (eggTypeName === undefined) {
                throw new Error('eggType name is undefined');
            }
            const eggMan = contr.getEggManager();
            const res4:Response = await request(app).get('/view?func=getEggType&name=' + eggTypeName);
            assert.strictEqual(res4.statusCode, 200);
            const eggTypeJson = await eggMan.getEggTypeJSON(eggTypeName)
            assert.strictEqual(res4.body, eggTypeJson);
            logoutUser();
        });
    });
    describe('getInteraction', () => {
        it('no name', async() => {
            const res2:Response = await request(app).get('/view?func=getInteraction');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'name is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getInteraction&name=id');
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            loginUser();
            const eggMan = contr.getEggManager();
            const res4:Response = await request(app).get('/view?func=getInteraction&name=inter2');
            assert.strictEqual(res4.statusCode, 200);
            const interTypeJson = await eggMan.getInteractionJSON("inter2")
            assert.strictEqual(res4.body, interTypeJson);
            logoutUser();
        });
    });
    describe('getAccessory', () => {
        it('no name', async() => {
            const res2:Response = await request(app).get('/view?func=getAccessory');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'name is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getAccessory&name=id');
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            loginUser();
            const eggMan = contr.getEggManager();
            const res4:Response = await request(app).get('/view?func=getAccessory&name=acc2');
            assert.strictEqual(res4.statusCode, 200);
            const interTypeJson = await eggMan.getAccessoryJSON("acc2")
            assert.strictEqual(res4.body, interTypeJson);
            logoutUser();
        });
    });
    describe('getUsername', () => {
        it('no user id', async() => {
            const res2:Response = await request(app).get('/view?func=getUsername');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'UserID is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getUsername&UserID=id');
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            loginUser();
            const userID = getUserID();
            const res4:Response = await request(app).get('/view?func=getUsername&UserID=' + userID.id);
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, contr.getCurrentUser()?.getUsername());
            logoutUser();
        });
    });
    describe('getAllEggInfo', () => {
        it('no user id', async() => {
            const res2:Response = await request(app).get('/view?func=getAllEggInfo');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'UserID is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getAllEggInfo&UserID=id');
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            loginUser();
            const userID = getUserID();
            const folders = contr.getCurrentUser()?.getTaskFolders();
            if (folders === undefined) {
                throw new Error('folderMap is undefined');
            }
            let allEggs:string[] = [];
            folders.forEach(element => {
                allEggs.push(element.getEgg().getJSON());
            });
            const res4:Response = await request(app).get('/view?func=getAllEggInfo&UserID=' + userID.id);
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, JSON.stringify(allEggs));
            logoutUser();
        });
    });
    describe('getAllTaskFolderInfo', () => {
        it('no user id', async() => {
            const res2:Response = await request(app).get('/view?func=getAllTaskFolderInfo');
            assert.strictEqual(res2.statusCode, 400);
            assert.strictEqual(res2.body, 'UserID is not defined or is not a string');
        });
        it('empty string', async () => {
            // user = undefined
            const res3:Response = await request(app).get('/view?func=getAllTaskFolderInfo&UserID=' + "id");
            assert.strictEqual(res3.statusCode, 200);
            assert.strictEqual(res3.body, "");
        });
        it('correct case', async() => {
            loginUser();
            const userID = getUserID();
            const folders = contr.getCurrentUser()?.getTaskFolders();
            if (folders === undefined) {
                throw new Error('folderMap is undefined');
            }
            const res4:Response = await request(app).get('/view?func=getAllTaskFolderInfo&UserID=' + userID.id);
            assert.strictEqual(res4.statusCode, 200);
            assert.strictEqual(res4.body, JSON.stringify(Array.from(folders.values())));
            logoutUser();
        });
    });
});