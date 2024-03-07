import express = require("express")
import FirebaseUserController from "../../controllers/firebase/userController";

const router = express.Router();

router.get("/getAll", FirebaseUserController.getAllUsers);
router.get("/get", FirebaseUserController.getUser);
router.post("/add", FirebaseUserController.addUser);
router.patch("/updateField", FirebaseUserController.updateField);
router.get("/getField", FirebaseUserController.getField);
// Add more routes here

export default router;
