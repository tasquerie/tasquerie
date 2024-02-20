import express from 'express';
import FirebaseTaskController from '../../controllers/firebase/taskController';

const router = express.Router();

router.get('/addUser', FirebaseTaskController.addUser);
router.get('/getAll', FirebaseTaskController.getAllTask);
router.get('/get', FirebaseTaskController.getTask);
router.patch('/updateField', FirebaseTaskController.updateField);
router.post("/addTask", FirebaseTaskController.addTask);
// router.patch('/updateField', FirebaseTaskController.updateField);
// router.get('/getField', FirebaseTaskController.getField);
// Add more routes here

export default router;
