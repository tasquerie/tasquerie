import {Request, Response } from "express";
import { db } from "../../../../firebase/firebase"

const collectionName = "taskInfo";
const FirebaseTaskController = {
    addUser: async (req: Request, res: Response) => {
        try {
            const { userID } = req.body;

            if (!userID) {
                res.status(400).json({ error: "Missing fields " });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            const snapshot = await documentRef.get();

            if (snapshot.exists) {
                res.status(404).json({ error: 'User already exists' });
                return;
              }

            await documentRef.set({});

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

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

    updateField: async (req: Request, res: Response) => {
        try {
            const { userID, taskID, fieldName, fieldValue } = req.body;

            if (!userID || !taskID || !fieldName || !fieldValue) {
                res.status(400).json({ error: "Missing fields" });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);

            const updateData = {
                [`${taskID}.${fieldName}`]: fieldValue,
            };

            await documentRef.update(updateData);

            res.json({ success: true });


        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    addTask: async (req: Request, res: Response) => {
        try {
            const { userID, taskID, taskData } = req.body;

            if (!userID || !taskID || !taskData) {
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
