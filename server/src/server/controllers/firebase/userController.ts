import { Request, Response } from 'express';
import { db } from "../../../../firebase/firebase"

const collectionName = "userInfo";
const FirebaseUserController = {

    // DEBUG: Only for testing purposes, there is no reason for the frontend to try to get
    // information about all uses in the system, only one at a time
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const collectionRef = db.collection(collectionName);
            const documents = await collectionRef.listDocuments();

            const usersMap: Record<string, any> = {};
            await Promise.all(
            documents.map(async (document) => {
                const snapshot = await document.get();
                usersMap[document.id] = snapshot.data();
            })
            );
            res.json(usersMap);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get user info on a given user UUID
    getUser: async (req: Request, res: Response) => {
        try {
            const { userID } = req.body;

            if (!userID) {
                res.status(400).json({ error: "Missing fields "})
            }
            // if (typeof targetUser !== 'string') {
            //     res.status(400).json({ error: 'Invalid user ID' });
            //     return;
            //   }

            const documentRef = db.collection(collectionName).doc(userID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                res.status(404).json({ error: 'User not found' });
                return;
              }

            res.json({ userID: snapshot.id, userData: snapshot.data() });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // NOTE: Example req body
    // {
    //     "userID": "sam_shin",
    //     "userData": {
    //       "name": "John Doe",
    //       "email": "john@example.com"
    //     }
    //   }
    addUser: async (req: Request, res: Response) => {
        try {
            const { userID, userData } = req.body;

            if (!userID || !userData) {
                res.status(400).json({ error: 'Missing fields' });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            await documentRef.set(userData);

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateField: async (req: Request, res: Response) => {
        try {
            const { userID, fieldName, fieldValue } = req.body;

            if (!userID || !fieldName || !fieldValue) {
                res.status(400).json({ error: 'Missing fields' });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            await documentRef.update({
                [fieldName]: fieldValue
            });

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getField: async (req: Request, res: Response) => {
        try {
            const { userID, fieldName } = req.body;

            if (!userID || !fieldName) {
                res.status(400).json({ error: "Missing fields" });
                return;
            }

            const documentRef = db.collection(collectionName).doc(userID);
            const snapshot = await documentRef.get();

            if (!snapshot.exists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const fieldValue = snapshot.data()?.[fieldName];

            if (fieldValue === undefined) {
                res.status(404).json({ error: 'Field not found' });
                return;
            }

            res.json({ [fieldName]: fieldValue });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default FirebaseUserController;
