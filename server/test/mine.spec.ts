import { Egg } from "../src/model/Egg";
import { FirebaseUserAPI, FirebaseTaskAPI } from "../src/firebaseAPI";
import { IDManager } from "../src/model/IDManager";
import { assert } from "chai";
import { TaskFolder } from "../src/model/TaskFolder";
import { User } from "../src/model/User";
import { WriteManager } from "../src/model/WriteManager";
describe('GetJson Function', function () {
	describe('getJson', function () {
		it('returns the JSON string for the Egg Object', async function () {
		    // let first = new Egg("eggType");

            // let result = await FirebaseUserAPI.getUser({id: "8Bz01S39P3330Yiicr5Z"})
            let result = await FirebaseTaskAPI.getTask({id: "8Bz01S39P3330Yiicr5Z"}, {id: "1707268104"})
            // const result = first.getJSON();
            console.log(result);
    });
  });
});

// describe("DB AddUser Function", async function () {
//     describe("Test", async function () {
//       let man = new IDManager();
//       let can = new TaskFolder("English", "This is English folder", "13");
//       let egg = new Egg("13");
//       let user = new User(man, "sam", "ben", "111")
//       user.
//       FirebaseUserAPI.addUser(new User(man, "sam", "ben", "234"))
//     }),
//     describe("Success", async function () {
//       it("Return added user successfully", async function () {
//         let man = new IDManager();
//         let write = new WriteManager();
//         write.useDB(true);
//         let user = new User(man, "aaa@gmail.com", "apple_apple");
//         const result = await write.writeUser(user);
//         console.log(result);
//         assert.equal("success", result);
//       });
//     });
//   });