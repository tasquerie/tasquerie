// Import the functions you need from the SDKs you need

import admin = require("firebase-admin");

admin.initializeApp();


// const serviceAccount: admin.ServiceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
// });

const db = admin.firestore();
// const db = app.getFirestore();
export { admin, db };
// export const auth = getAuth(app);
// export const database = getFirestore(app);
