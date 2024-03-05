import { User } from "./model/User";
import { db } from "../firebase/firebase"
import { deleteField } from "firebase/firestore";
import { UserID } from "./types/UserID";
import { TaskID } from "./types/TaskID";
import { Result } from "./types/FirebaseResult"
import { Task } from "./model/Task";
import { EggType } from "./types/EggType";
import { Interaction } from "./types/Interaction";
import { Accessory } from "./types/Accessory";

export const FirebaseUserAPI = {
    /**
     * Adds user to db. Status indicates if operation was successful.
     * If db is modified after this function call, status is true. Otherwise, false.
     *
     * If successful, content is "success".
     * If the given User already exists in the db, content is undefined.
     * If server error, content is error code.
     * @param user User object to add to db
     * @returns Promise \<Result\> { status: boolean, content: string | undefined }
     */
    addUser: async (user: User): Promise<Result> => {
        try {
            const userID = user.getID();
            const documentRef = db.collection("userInfo").doc(userID.id);
            const snapshot = await documentRef.get();
            console.log("A");
            if (snapshot.exists) {
                console.log("B");
                return { status: false, content: JSON.stringify(snapshot.data()) };
            }
            console.log("C");
            await documentRef.set(user.toFirestoreObject());

            return { status: true, content: "success" };
        } catch (err: any) {
            console.log("D");
            console.log(err);
            return { status: false, content: err.code }
        }
    },


    /**
     * Returns the user in db given UID.
     * If something is read from the db after this function call, status is true.
     * Otherwise, if nothing is read from db or there is server error, status is false.
     *
     * If the given userID has a match, content is User object
     * If the given userID has no matching user in db, content is undefined.
     * If server error, content is error code.
     * @param userID user id of the user to query
     * @returns Promise \<Result\> { status: boolean, content: User | string | undefined }
     */
    getUser: async (userID: UserID): Promise<Result> => {
        try {
            const UID = userID.id;
            const documentRef = db.collection("userInfo").doc(UID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                return { status: false, content: undefined };
            }
            const data = snapshot.data() as User;
            return {status: true, content: data }
        } catch (err: any) {
            return { status: false, content: err.code }
        }
    },
}



export const FirebaseTaskAPI =  {
    /**
     * Adds a task to db. Status indicates if operation was successful.
     * If db is modified after this fucntion call, status is true, Otherwise, false.
     *
     * If successful, content is "success".
     * If the given userID does not exist in the db, content is undefined.
     * If server error, content is error code.
     * @param task Task object to add to db
     * @returns Promise \<Result\> { status: boolean, content: string | undefined }
     */
    addTask: async (task: Task): Promise<Result> => {
        try {
            const UID = task.getOwner().id;
            const TID = task.getID().id;

            const documentRef = db.collection("taskInfo").doc(UID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                return { status: false, content: undefined };
            }

            await documentRef.update({
                TID: task
            });

            return { status: true, content: "success" };
        } catch (err: any) {
            return { status: false, content: err.code };
        }
    },


    /**
     * Given a Task, we delete that task from the db.
     *
     * If successful, content is "success".
     * If the given Task does not exist in the db, content is undefined.
     * If server error, content is error code.
     * @param task  Task object to delete
     * @returns Promise \<Result\> { status: boolean, content: string | undefined }
     */
    removeTask: async (task: Task): Promise<Result> => {
        try {
            const UID = task.getOwner().id;
            const TID = task.getID().id;

            const documentRef = db.collection("taskInfo").doc(UID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                return { status: false, content: undefined };
            }

            await documentRef.update({
                TID: deleteField()
            })

            return { status: true, content: "success" };
        } catch (err: any) {
            return { status: false, content: err.code };
        }
    },


    /**
     * Given a userID and taskID, queries the task.
     * If something is read from the db after this fucntion call, status is true.
     * Otherwise, if nothing is read from db or there is server error, status is false.
     *
     * If the given userID or taskID has no matching user in db or task, content is undefined.
     * If server error, content is error code.
     * @param userID user id of the user to query
     * @param taskID  task id of the task to query
     * @returns Promise \<Result\> { status: boolean, content: Task | string | undefined }
     */
    getTask: async (userID: UserID, taskID: TaskID): Promise<Result> => {
        try {
            const UID = userID.id;
            const TID = taskID.id;

            const documentRef = db.collection("taskInfo").doc(UID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                return { status: false, content: undefined };
            }

            const task = snapshot.data()?.[TID];
            if (task !== undefined) {
                const data = task as Task;
                return { status: true, content: data };
            } else {
                return { status: false, content: undefined }
            }
        } catch (err: any) {
            return { status: false, content: err.code }
        }
    },
}



export const FirebaseDataAPI = {
    /**
     * Given a document to query and name to fetch, return the read-only data associated with
     * the given parameters.
     *
     * If something is read from the db after this function call, status is true.
     * Otherwise, if nothing is read from db or there is server error, status is false.
     *
     * If the given document does not exist, content is undefined.
     * If server error, content is error code
     * @param document document name to query in db
     * @param name specific item to fetch
     * @returns Promise \<Result\> { status: boolean, content: EggType | Interaction | Accessory | string | undefined }
     */
    getType: async (document: string, name: string): Promise<Result> => {
        try {
            const documentRef = db.collection("Data").doc(document);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                return { status: false, content: undefined };
            }

            const type = snapshot.data()?.[name];
            if (type !== undefined) {
                let data = undefined
                if (document === "egg") {
                    data = type as EggType;
                } else if (document == "interaction") {
                    data = type as Interaction;
                } else {
                    data = type as Accessory;
                }
                return { status: true, content: data };
            } else {
                return { status: false, content: undefined };
            }
        } catch (err: any) {
            return { status: false, content: err.code }
        }
    },
}
