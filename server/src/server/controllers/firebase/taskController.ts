import {Request, Response } from "express";
import { db } from "../../../../firebase/firebase"

const collectionName = "taskInfo";
const FirebaseTaskController = {


    getAllTask: async (req: Request, res: Response) => {
        try {
            const { userID } = req.body;

            if (!userID) {
                res.status(400).json({ error: "Mising fields" });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            res.json({ tasks: snapshot.data() });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },


    /*
    GET http://localhost:3000/api/firebase/task/get
    {
    "userID": "sam_shin",
    "taskID": "12321312",
    }
    */
    getTask: async (req: Request, res: Response) => {
        try {
            const { userID, taskID } = req.body;

            if (!userID || !taskID) {
                res.status(400).json({ error: "Missing fields" });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const task = snapshot.data()?.[taskID];

            if (task !== undefined) {
                res.json({ [taskID]: task });
            } else {
                res.status(404).json({ error: 'Task not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    /*
    PATCH http://localhost:3000/api/firebase/task/updateField
    {
    "userID": "sam_shin",
    "taskID": "12321312",
    "fieldName": "description",
    "fieldValue": "This is due now!"
    }
    */
    updateField: async (req: Request, res: Response) => {
        try {
            const { userID, taskID, fieldName, fieldValue } = req.body;

            if (!userID || !taskID || !fieldName || !fieldValue) {
                res.status(400).json({ error: "Missing fields" });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            const fieldPath = `${taskID}.${fieldName}`;

            await documentRef.update({
                [fieldPath]: fieldValue
            });


            res.json({ success: true });


        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    /*
    POST http://localhost:3000/api/firebase/task/addTask
    {
    "userID": "sam_shin",
    "taskData": {
        "12321312": {
            "uniqueID": "email",
            "name": "CSE 142",
            "isComplete": false,
            "description": "HW1 due tomorrow",
            "startDate": "12321312",
            "endDate": "13123123121"
            }
        }
    }
    */
    addTask: async (req: Request, res: Response) => {
        try {
            const { userID, taskData } = req.body;

            if (!userID || !taskData) {
                res.status(400).json({ error: "Missing field" });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            await documentRef.set(taskData)

            res.json({ success: true})
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "internal Server Error" });
        }
    }
}

export default FirebaseTaskController;
