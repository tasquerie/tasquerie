/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// export const helloWorldPlaces = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from helloWorldPlaces!");
// });

import * as functions from "firebase-functions";
import * as express from "express";
import userRoutes from "./routes/firebase/userRoutes";
import taskRoutes from "./routes/firebase/taskRoutes";
import * as cors from "cors";
// const corsHandler = cors({origin: true});
const app = express();

app.use(express.json());
app.use(cors());

app.use("/firebase/user", userRoutes);
app.use("/firebase/task", taskRoutes);

// // Define routes and controllers
// app.get("/api/users", (req, res) => {
//   // Controller logic for handling GET /api/users
//   res.send("Get all users");
// });

// app.post("/api/users", (req, res) => {
//   // Controller logic for handling POST /api/users
//   res.send("Create a new user");
// });

// Export Express app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);
