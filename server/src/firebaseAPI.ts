import { User } from "./model/User";
import { db } from "../firebase/firebase"
import { DocumentData, deleteField } from "firebase/firestore";
import { UserID } from "./types/UserID";
import { TaskID } from "./types/TaskID";
import { Result } from "./types/FirebaseResult"
import { Task } from "./model/Task";

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
            const documentRef = db.collection("userInfo").doc(userID as unknown as string);
            const snapshot = await documentRef.get();

            if (snapshot.exists) {
                return { status: false, content: undefined };
            }

            await documentRef.set(user);

            return { status: true, content: "success" };
        } catch (err: any) {
            return { status: false, content: err.code }
        }
    },

    /**
     * Returns the user in db given UID.
     * If something is read from the db after this function call, status is true.
     * Otherwise, if nothing is read from db or there is server error, status is false.
     *
     * If the given userID has no matching user in db, content is undefined.
     * If server error, content is error code.
     * @param userID user id of the user to query
     * @returns Promise \<Result\> { status: boolean, content: string | undefined }
     */
    getUser: async (userID: UserID): Promise<Result> => {
        try {
            const UID = userID.id;
            const documentRef = db.collection("userInfo").doc(UID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                return { status: false, content: undefined };
            }

            return {status: true, content: JSON.stringify(snapshot.data()) }
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
     * @returns
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

    // NOTE: I don't like how it takes entire task object
    /**
     *
     * @param task  Task object
     * @returns
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
     * If server error, content is erro code.
     * @param userID user id of the user to query
     * @param taskID  task id of the task to query
     * @returns Promise \<Result\> { status: boolean, content: string | undefined }
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
                return { status: true, content: JSON.stringify(task) };
            } else {
                return { status: false, content: undefined }
            }
        } catch (err: any) {
            return { status: false, content: err.code }
        }
    },


}
