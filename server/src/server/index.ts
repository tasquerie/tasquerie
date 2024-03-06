import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { UserID } from "../types/UserID";
import { TaskID } from "../types/TaskID";
import { IDManager } from "../model/IDManager";
import { UserManager } from "../model/UserManager";
import { EggManager } from "../model/EggManager";
import { WriteManager } from "../model/WriteManager";
import { ModelController } from "../ModelController";
import { ModelView } from "../ModelView";
import { logEvent } from "firebase/analytics";

import userRoutes from './routes/firebase/userRoutes';
import taskRoutes from './routes/firebase/taskRoutes';
import { Task } from "../model/Task";
dotenv.config();

const app : Express = express();
const port = process.env.PORT || 3000;
const newline = "<br>";
const okResp = "HTTP/1.1 200 OK";
const badReq = "HTTP/1.1 400 Bad Request";


// important setup!!
const idMan     = new IDManager();
const userMan   = new UserManager(idMan);
const eggMan    = new EggManager();
const writeMan  = new WriteManager();
const contr     = new ModelController(userMan, idMan, eggMan, writeMan);
const viewer    = new ModelView(idMan, eggMan);

// Security Issue
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
    windowMS: 15 * 60 * 1000, // 15 min
    max:200,
    message: "Too many requests from this IP, try after 15 min"
});

app.use(express.json());
app.use('/api/firebase/user', userRoutes);
app.use('/api/firebase/task', taskRoutes);

export function getIDMan(): IDManager {
    return idMan;
}

export function getContr(): ModelController {
    return contr;
}

export function getViewer(): ModelView {
    return viewer;
}

function checkStringArray(input:any): boolean {
    if (!Array.isArray(input)) {
        return false;
    } else {
        for (let element of input) {
            if (typeof(element) !== 'string') {
                return false;
            }
        }
        return true;
    }
}

function checkUserIDArray(input:any): boolean {
    if (!Array.isArray(input)) {
        return false;
    } else {
        for (let element of input) {
            if (!(typeof element === "object" && element !== null && "id" in element && typeof element.id === "string")) {
                return false;
            }
        }
        return true;
    }
}

function checkID(input:any):boolean {
    return (typeof(input) === "object" && input !== null && "id" in input && typeof(input.id) === "string");
}

app.get("/", (req: Request, res: Response) => {
    res.send("all my fellas");
});

// for view methods
app.get("/view", async (req: Request, res: Response) => {
    // url: http://localhost:3000/view?func=getUserInfo&id="temporaryId"
    console.log('--- view called ---');
    console.log(req.body);
    res.set('Access-Control-Allow-Origin', 'http://localhost:3232');
    let request = req.query;
    let result = "";
    let error = "";
    switch(request.func) {
        case "getUserInfo":
            const userInfoID = request.UserID;
            if (typeof(userInfoID) !== "string") {
                error = "UserID is not defined or is not a string";
                break;
            }
            // let userInfoUserID:UserID;
            // try {
            //     userInfoUserID = JSON.parse(userInfoID);
            // } catch (err:any) {
            //     error = "UserID is not a JSON string";
            //     break;
            // }

            const userInforUserID:UserID = {id: userInfoID};
            result = await viewer.getUserInfo(userInforUserID);
            break;
        case "getTaskInfo":
            const userTaskID = request.UserID;
            if (typeof(userTaskID) !== "string") {
                error = "UserID is not defined or is not a string";
                break;
            }
            const taskIdStr = request.TaskID;
            if (typeof(taskIdStr) !== "string") {
                error = "TaskID is not defined or is not a string";
                break;
            }

            let taskInfoUserID:UserID;
            try {
                taskInfoUserID = JSON.parse(userTaskID);
            } catch (err:any) {
                error = "UserID is not a JSON string";
                break;
            }
            let taskID:TaskID;
            try {
                taskID = JSON.parse(taskIdStr);
            } catch (err:any) {
                error = "TaskID is not a JSON string";
                break;
            }

            result = await viewer.getTaskInfo(taskInfoUserID, taskID);
            break;
        case "getTaskFolderInfo":
            const tfUserIdStr = request.UserID;
            if (typeof(tfUserIdStr) !== "string") {
                error = "UserID is not defined or is not a string";
                break;
            }
            const tfFolderNameStr = request.folderName;
            if (typeof(tfFolderNameStr) !== "string") {
                error = "folderName is not defined or is not a string";
                break;
            }
            let tfUserID:UserID;
            try {
                tfUserID = JSON.parse(tfUserIdStr);
            } catch (err:any) {
                error = "UserID is not a JSON string";
                break;
            }
            let tfFolderName:string;
            try {
                tfFolderName = JSON.parse(tfFolderNameStr);
            } catch (err:any) {
                error = "folderName is not a JSON string";
                break;
            }

            result = await viewer.getTaskFolderInfo(tfUserID, tfFolderName);
            break;
        case "getEggInfo":
            const eggUserIdStr = request.UserID;
            if (typeof(eggUserIdStr) !== "string") {
                error = "UserID is not defined or is not a string";
                break;
            }
            const eggFolderNameStr = request.folderName;
            if (typeof(eggFolderNameStr) !== "string") {
                error = "folderName is not defined or is not a string";
                break;
            }
            let eggUserID:UserID;
            try {
                eggUserID = JSON.parse(eggUserIdStr);
            } catch (err:any) {
                error = "UserID is not a JSON string";
                break;
            }
            let eggFolderName:string;
            try {
                eggFolderName = JSON.parse(eggFolderNameStr);
            } catch (err:any) {
                error = "folderName is not a JSON string";
                break;
            }

            result = await viewer.getEggInfo(eggUserID, eggFolderName);
            break;
        case "getEggType":
            const eggNameStr  = request.name;
            if (typeof(eggNameStr) !== "string") {
                error = "name is not defined or is not a string";
                break;
            }
            let eggName:string;
            try {
                eggName = JSON.parse(eggNameStr);
            } catch (err:any) {
                error = "name is not a JSON string";
                break;
            }

            result = await viewer.getEggType(eggName);
            break;
        case "getInteraction":
            const interNameStr  = request.name;
            if (typeof(interNameStr) !== "string") {
                error = "name is not defined or is not a string";
                break;
            }
            let interName:string;
            try {
                interName = JSON.parse(interNameStr);
            } catch (err:any) {
                error = "name is not a JSON string";
                break;
            }

            result = await viewer.getInteraction(interName);
            break;
        case "getAccessory":
            const accesNameStr  = request.name;
            if (typeof(accesNameStr) !== "string") {
                error = "name is not defined or is not a string";
                break;
            }
            let accesName:string;
            try {
                accesName = JSON.parse(accesNameStr);
            } catch (err:any) {
                error = "name is not a JSON string";
                break;
            }

            result = await viewer.getAccessory(accesName);
            break;
        case "getUsername":
            const userNameStr  = request.UserID;
            if (typeof(userNameStr) !== "string") {
                error = "UserID is not defined or is not a string";
                break;
            }
            let userName:UserID;
            try {
                userName = JSON.parse(userNameStr);
            } catch (err:any) {
                error = "UserID is not a JSON string";
                break;
            }

            result = await viewer.getUsername(userName);
            break;
        case "getAllEggInfo":
            const allEggStr  = request.UserID;
            if (typeof(allEggStr) !== "string") {
                error = "UserID is not defined or is not a string";
                break;
            }
            let allEgg:UserID;
            try {
                allEgg = JSON.parse(allEggStr);
            } catch (err:any) {
                error = "UserID is not a JSON string";
                break;
            }

            result = await viewer.getAllEggInfo(allEgg);
            break;
        case "getAllTaskFolderInfo":
            const allTaskFoldStr  = request.UserID;
            if (typeof(allTaskFoldStr) !== "string") {
                error = "UserID is not defined or is not a string";
                break;
            }
            const allTaskFold:UserID = {id:allTaskFoldStr};
            // try {
            //     allTaskFold = JSON.parse(allTaskFoldStr);
            // } catch (err:any) {
            //     error = "UserID is not a JSON string";
            //     break;
            // }

            result = await viewer.getAllTaskFolderInfo(allTaskFold);
            break;
        default:
            error = 'The function of the request is not defined';
    }
    if (error !== "") {
        res.status(400).send(error);
    } 
    // else if (result === "") {
    //     res.status(400).send("The requested view does not exist");
    // } 
    else {
        res.send(result);
    }
});

// Security issue
app.use(limiter);
app.use(express.json());

// for login methods
app.post("/login", async (req: Request, res: Response) => {
    // url: http://localhost:3000/login
    res.set('Access-Control-Allow-Origin', 'http://localhost:3232');
    let result = "";
    let error = "";
    let func = req.body.func;
    switch(func) {
        case "login":
            const loginUserName = req.body.username;
            if (typeof(loginUserName) !== "string") {
                error = ("username is not defined or is not a string");
                break;
            }
            const loginPassword = req.body.password;
            if (typeof(loginPassword) !== "string") {
                error = ("password is not defined or is not a string");
                break;
            }
            result = "" + contr.login(loginUserName, loginPassword);
            break;
        case "logout":
            contr.logout();
            break;
        case "signup":
            const signupUserName = req.body.username;
            if (typeof(signupUserName) !== "string") {
                error = ("username is not defined or is not a string");
                break;
            }
            const signupPassword = req.body.password;
            if (typeof(signupPassword) !== "string") {
                error = ("password is not defined or is not a string");
                break;
            }
            try {
                result = "" + await contr.signup(signupUserName, signupPassword);
            } catch (err:any){
                error = err.message;
            }
            break;
        default:
            error = "The function of the request is not defined";
    }
    if (error !== "") {
        res.status(400).json(error);
    } else {
        res.send(result);
    }
});

// for controller methods
app.post("/controller", async (req: Request, res: Response) => {
    console.log('--- controller called ---');
    console.log(req.body);
    // url: http://localhost:3000/controller
    res.set('Access-Control-Allow-Origin', 'http://localhost:3232');
    let func = req.body.func;
    let result;
    let error = ""
    switch(func) {
        case "addFolder":
            const addFolderID = req.body.UserID;
            if (!checkID(addFolderID)) {
                error = "Wrong type for User ID";
                break;
            }
            const addFolderName = req.body.name;
            if (typeof(addFolderName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const addFolderDesc = req.body.description;
            if (typeof(addFolderDesc) !== 'string') {
                error = "The description of the folder is undefined or is not a string";
                break;
            }
            const addFolderEggType = req.body.eggType;
            if (typeof(addFolderEggType) !== 'string') {
                error = "The egg type of the folder is undefined or is not a string";
                break;
            }
            try {
                await contr.addFolder(addFolderID, addFolderName, addFolderDesc, addFolderEggType);
                // For testing only. Make sure to put it as a comment after testing
                result = "addFolder";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "setFolder":
            const setFolderID = req.body.UserID;
            if (!checkID(setFolderID)) {
                error = "Wrong type for User ID";
                break;
            }
            const setFolderName = req.body.name;
            if (typeof(setFolderName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const setFolderNewName = req.body.newName;
            if (setFolderNewName !== undefined && typeof(setFolderNewName) !== 'string') {
                error = "The type of the new name is not a string but is defined";
                break;
            }
            const setFolderDesc = req.body.description;
            if (setFolderDesc !== undefined && typeof(setFolderDesc) !== 'string') {
                error = "The type of the description is not a string but is defined";
                break;
            }
            try {
                await contr.setFolder(setFolderID, setFolderName, setFolderNewName, setFolderDesc);
                // For testing only. Make sure to put it as a comment after testing
                result = "setFolder";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "deleteFolder":
            const deleteFolderID = req.body.UserID;
            if (!checkID(deleteFolderID)) {
                error = "Wrong type for User ID";
                break;
            }
            const delFolderName = req.body.name;
            if (typeof(delFolderName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            try {
                
                await contr.deleteFolder(deleteFolderID, delFolderName);
                // For testing only. Make sure to put it as a comment after testing
                result = "deleteFolder";
            } catch (err:any){
                error = err.message;
            }
            break;
        case "addTask":
            const addTaskUserID = req.body.UserID;
            if (!checkID(addTaskUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const addTaskFoldName = req.body.folderName;
            if (typeof(addTaskFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const addTaskName = req.body.taskName;
            if (typeof(addTaskName) !== 'string') {
                error = "The name of the task is undefined or is not a string";
                break;
            }
            const addTaskDesc = req.body.description;
            if (typeof(addTaskDesc) !== 'string') {
                error = "The description is undefined or is not a string";
                break;
            }
            const addTaskTags = req.body.tags;
            if (!checkStringArray(addTaskTags)) {
                error = "The tags of the Task is not a string array";
                break;
            }
            const addTaskShared = req.body.whoSharedWith;
            if (!checkUserIDArray(addTaskShared)) {
                error = "The shared list is not a UserID";
                break;
            }
            const addTaskStart = req.body.startDate;
            if (addTaskStart !== undefined && typeof(addTaskStart) !== 'string') {
                error = "The type of startDate is not a string but is defined";
                break;
            }
            const addTaskCycle = req.body.cycleDuration;
            if (addTaskCycle !== undefined && typeof(addTaskCycle) !== 'string') {
                error = "The type of cycleDuration is not a string but is defined";
                break;
            }
            const addTaskDeadline = req.body.deadline;
            if (addTaskDeadline !== undefined && typeof(addTaskDeadline) !== 'string') {
                error = "The type of deadline is not a string but is defined";
                break;
            }
            try {
                result = await contr.addTask(addTaskUserID, addTaskFoldName, addTaskName, addTaskDesc,
                                            addTaskTags, addTaskShared, addTaskStart,
                                            addTaskCycle, addTaskDeadline);
            } catch (err:any){
                error = err.message;
            }
            break;
        case "setTask":
            const setTaskUserID = req.body.UserID;
            if (!checkID(setTaskUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const setTaskId = req.body.TaskID;
            if (!checkID(setTaskId)) {
                error = "The id is undefined or is not a string";
                break;
            }
            const setTaskCompl = req.body.isComplete;
            if (setTaskCompl !== undefined && typeof(setTaskCompl) !== 'boolean') {
                error = "The type of isComplete is not a boolean but is defined";
                break;
            }
            const setTaskName = req.body.taskName;
            if (setTaskName !== undefined && typeof(setTaskName) !== 'string') {
                error = "The type of taskName is not a string but is defined";
                break;
            }
            const setTaskDesc = req.body.description;
            if (setTaskDesc !== undefined && typeof(setTaskDesc) !== 'string') {
                error = "The type of description is not a string but is defined";
                break;
            }
            const setTaskTags = req.body.tags;
            if (setTaskTags !== undefined && !checkStringArray(setTaskTags)) {
                error = "The type of tags is not a string array but is defined";
                break;
            }
            const setTaskShared = req.body.whoSharedWith;
            if (setTaskShared !== undefined && !checkUserIDArray(setTaskShared)) {
                error = "The type of shared list is not a string array but is defined";
                break;
            }
            const setTaskStart = req.body.startDate;
            if (setTaskStart !== undefined && typeof(setTaskStart) !== 'string') {
                error = "The type of startDate is not a string but is defined";
                break;
            }
            const setTaskCycle = req.body.cycleDuration;
            if (setTaskCycle !== undefined && typeof(setTaskCycle) !== 'string') {
                error = "The type of cycleDuration is not a string but is defined";
                break;
            }
            const setTaskDeadline = req.body.deadline;
            if (setTaskDeadline !== undefined && typeof(setTaskDeadline) !== 'string') {
                error = "The type of deadline is not a string but is defined";
                break;
            }
            try {
                await contr.setTask(setTaskUserID, setTaskId, setTaskCompl,
                                            setTaskName, setTaskDesc, setTaskTags,
                                            setTaskShared, setTaskStart, setTaskCycle,
                                            setTaskDeadline);
                // Only for testing. Comment if not needed
                result = "setTask";
            } catch (err:any){
                error = err.message;
            }
            break;
        case "deleteTask":
            const deleteTaskUserID = req.body.UserID;
            if (!checkID(deleteTaskUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const delTaskFoldName = req.body.folderName;
            if (typeof(delTaskFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const delTaskID = req.body.TaskID;
            if (!checkID(delTaskID)) {
                error = "The id is undefined or is not a string";
                break;
            }
            try {
                await contr.deleteTask(deleteTaskUserID, delTaskFoldName, delTaskID);
                //For testing only. Comment if not used
                result = "deleteTask";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "addUnivCredits":
            const addUCredUserID = req.body.UserID;
            if (!checkID(addUCredUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const addUCred = req.body.amount;
            if (typeof(addUCred) !== 'number') {
                error = "The amount is undefined or is not a number";
                break;
            }
            try {
                await contr.addUnivCredits(addUCredUserID, addUCred);
                //For testing only. Comment if not used
                result = "addUnivCredits";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "removeUnivCredits":
            const removeUCredUserID = req.body.UserID;
            if (!checkID(removeUCredUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const remUCred = req.body.amount;
            if (typeof(remUCred) !== 'number') {
                error = "The amount is undefined or is not a number";
                break;
            }
            try {
                await contr.removeUnivCredits(removeUCredUserID, remUCred);
                //For testing only. Comment if not used
                result = "removeUnivCredits";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "addEggCredits":
            const addEggCredUserID = req.body.UserID;
            if (!checkID(addEggCredUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const addAmount = req.body.amount;
            if (typeof(addAmount) !== 'number') {
                error = "The amount is undefined or is not a number";
                break;
            }
            const addEggCredFoldName = req.body.folderName;
            if (typeof(addEggCredFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            try {
                await contr.addEggCredits(addEggCredUserID, addAmount, addEggCredFoldName);
                //For testing only. Comment if not used
                result = "addEggCredits";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "removeEggCredits":
            const removeEggCredUserID = req.body.UserID;
            if (!checkID(removeEggCredUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const remAmount = req.body.amount;
            if (typeof(remAmount) !== 'number') {
                error = "The amount is undefined or is not a number";
                break;
            }
            const remEggCredFoldName = req.body.folderName;
            if (typeof(remEggCredFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            try {
                await contr.removeEggCredits(removeEggCredUserID, remAmount, remEggCredFoldName);
                //For testing only. Comment if not used
                result = "removeEggCredits";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "buyAccessory":
            const AccessUserID = req.body.UserID;
            if (!checkID(AccessUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const AccessFoldName = req.body.folderName;
            if (typeof(AccessFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const AccessType = req.body.accessoryType;
            if (typeof(AccessType) !== 'string') {
                error = "The type of the accessory is undefined or is not a string";
                break;
            }
            try {
                result = "" + await contr.buyAccessory(AccessUserID, AccessFoldName, AccessType);
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "buyInteraction":
            const InterUserID = req.body.UserID;
            if (!checkID(InterUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const InterFoldName = req.body.folderName;
            if (typeof(InterFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const InterType = req.body.interactionType;
            if (typeof(InterType) !== 'string') {
                error = "The type of the interaction is undefined or is not a string";
                break;
            }
            try {
                result = "" + await contr.buyInteraction(InterUserID, InterFoldName, InterType);
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "gainExp":
            const expUserID = req.body.UserID;
            if (!checkID(expUserID)) {
                error = "Wrong type for User ID";
                break;
            }
            const expAmount = req.body.amount;
            if (typeof(expAmount) !== 'number') {
                error = "The amount is undefined or is not a number";
                break;
            }
            const expFoldName = req.body.folderName;
            if (typeof(expFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            try {
                await contr.gainExp(expUserID, expAmount, expFoldName);
                result = "gainExp";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "equipAccessory":
            const equipAccessID = req.body.UserID;
            if (!checkID(equipAccessID)) {
                error = "Wrong type for User ID";
                break;
            }
            const equipAccessFoldName = req.body.folderName;
            if (typeof(equipAccessFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const equipAccessory = req.body.accessory;
            if (typeof(equipAccessory) !== 'string') {
                error = "The accessory is undefined or is not a string";
                break;
            }
            try {
                // TODO: change if we are gonna change to returning boolean
                //result = "" + await contr.equipAccessory(equipAccessID, equipAccessFoldName, equipAccessory);
                await contr.equipAccessory(equipAccessID, equipAccessFoldName, equipAccessory);
                //Only for testing. Comment if not used
                result = "equipAccessory";
            } catch (err:any) {
                error = err.message;
            }
            break;
        case "unequipAccessory":
            const unequipAccessID = req.body.UserID;
            if (!checkID(unequipAccessID)) {
                error = "Wrong type for User ID";
                break;
            }
            const unequipAccessFoldName = req.body.folderName;
            if (typeof(unequipAccessFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const unequipAccessory = req.body.accessory;
            if (typeof(unequipAccessory) !== 'string') {
                error = "The accessory is undefined or is not a string";
                break;
            }
            try {
                await contr.unequipAccessory(unequipAccessID, unequipAccessFoldName, unequipAccessory);
                //Only for testing. Comment if not used
                result = "unequipAccessory";
            } catch (err:any) {
                error = err.message;
            }
            break
        default:
            error = "The function of the request is not defined";
    }
    // There is some functions that doesn't return anything
    // making result = "". CHECK: what to return for those function.
    if (error != "") {
        res.status(400).json(error);
    } else {
        res.json(result);
    }
});

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('connection', () => {
    console.log('connection detected');
});

// Only for testing purpose
export default app;