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

function println(appendStr: string) {
    return appendStr + newline;
}

function checkString(input:any, strName:string, res:Response) {
    if (typeof(input) !== 'string') {
        res.status(400).send(strName + " is not defined or is not a string");
    }
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

function checkDateTime(input:any): boolean {
    return (typeof(input) === "object" && input !== null &&
            "year" in input && typeof(input.year) === 'number' &&
            "month" in input && typeof(input.month) === 'number' &&
            "day" in input && typeof(input.day) === 'number' &&
            "hour" in input && typeof(input.hour) === 'number' &&
            "minute" in input && typeof(input.minute) === 'number'
            );
}

function checkDuration(input:any): boolean {
        return (typeof(input) === "object" && input !== null &&
                "weeks" in input && typeof(input.weeks) === 'number' &&
                "days" in input && typeof(input.days) === 'number' &&
                "hours" in input && typeof(input.hours) === 'number'
                );
}

function checkTaskID(input:any):boolean {
    return (typeof(input) === "object" && input !== null && "id" in input && typeof(input.id) === "string");
}

app.get("/", (req: Request, res: Response) => {
    res.send("all my fellas");
});

app.get("/test", (req: Request, res: Response) => {
    let reqObj = req.query;
    let resStr = "";
    // url: http://localhost:3000/test?func=login&arg1=username&arg2=password
    resStr += okResp + newline + newline;
    resStr += println("func: " + reqObj.func);
    resStr += println("arg1: " + reqObj.arg1);
    resStr += println("full query: " + req.query);
    res.send(resStr);
    /**
     * req.query will be how we will get information from the request
     * append '?var1=value1&var2=value2' etc to the endpoint, e.g. 'localhost:3000/user?var1=value1&var2=value2'
     * req.query looks like a json where the one above will turn out to be
     * {
     *  'var1': 'value1',
     *  'var2': 'value2'
     * }
     */
    /**
     * /////// SPECS ///////////
     * endpoints correspond to data classes/types
     * frontend can call a function associated with a class with the following format:
     * localhost:3232/[class]?target=[function name]&[parameters]
     * parameters should match target function parameters directly
     * for example, to call getEggType(name: string),
     * [parameters] would be name=[query name]
     * the whole request would look like:
     * localhost:3232/egg?target=getEggType&name=[query name]
     */
});

// for view methods
app.get("/view", (req: Request, res: Response) => {
    let request = req.query;
    let result = "";
    let error = "";
    switch(request.func) {
        case "getUserInfo":
            const userIdStr = request.id;
            if (typeof userIdStr !== "string") {
                error = "id is not defined or is not a string";
                break;
            }
            const userID: UserID = {
                id: userIdStr
            }
            // Testing without db
            result = "getUserInfo";
            //result = viewer.getUserInfo(userID);
            break;
        case "getTaskInfo":
            const taskIdStr = request.id;
            if (typeof(taskIdStr) !== "string") {
                error = "id is not defined or is not a string";
                break;
            }
            const taskID: TaskID = {
                id: taskIdStr
            }
            // Testing without db
            result = "getTaskInfo";
            //result = viewer.getTaskInfo(taskID);
            break;
        case "getTaskFolderInfo":
            const tfUserIdStr = request.id;
            if (typeof(tfUserIdStr) !== "string") {
                error = "id is not defined or is not a string";
                break;
            }
            const tfFolderNameStr = request.folderName;
            if (typeof(tfFolderNameStr) !== "string") {
                error = "folderName is not defined or is not a string";
                break;
            }
            const tfUserID: UserID = {
                id: tfUserIdStr
            }
            // Testing without db
            result = "getTaskFolderInfo";
            //result = viewer.getTaskFolderInfo(tfUserID, tfFolderNameStr);
            break;
        case "getEggInfo":
            const eggUserIdStr = request.id;
            if (typeof(eggUserIdStr) !== "string") {
                error = "id is not defined or is not a string";
                break;
            }
            const eggFolderNameStr = request.folderName;
            if (typeof(eggFolderNameStr) !== "string") {
                error = "folderName is not defined or is not a string";
                break;
            }
            const eUserID: UserID = {
                id: eggUserIdStr
            }
            // Testing without db
            result = "getEggInfo";
            //result = viewer.getEggInfo(eUserID, eggFolderNameStr);
            break;
        case "getEggType":
            const eggName  = request.name;
            if (typeof(eggName) !== "string") {
                error = "name is not defined or is not a string";
                break;
            }
            // Testing without db
            result = "getEggType";
            //result = viewer.getEggType(eggName);
            break;
        case "getInteraction":
            const interName  = request.name;
            if (typeof(interName) !== "string") {
                error = "name is not defined or is not a string";
                break;
            }
            // Testing without db
            result = "getInteraction";
            //result = viewer.getInteraction(interName);
            break;
        case "getAccessory":
            const accesName  = request.name;
            if (typeof(accesName) !== "string") {
                error = "name is not defined or is not a string";
                break;
            }
            // Testing without db
            result = "getAcessory";
            //result = viewer.getAccessory(accesName);
            break;
        default:
            error = "The function of the request is not defined";
    }
    if (error !== "") {
        res.status(400).send(error);
    } else if (result === "") {
        res.status(400).send("The requested view does not exist");
    }
    res.send(result);
});

// // for login methods
app.post("/login", (req: Request, res: Response) => {
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
            result = "logout successful";
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
                result = "" + contr.signup(signupUserName, signupPassword);
            } catch (err:any){
                error = err.message;
            }
            break;
        default:
            error = "The function of the request is not defined";
    }
    if (error !== "") {
        res.status(400).send(error);
    }
    res.send(result);
});

// for controller methods
app.post("/controller", (req: Request, res: Response) => {
    let func = req.body.func;
    let result = "";
    let error = ""
    switch(func) {
        case "addFolder":
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
                // CHECK: what are we returning back to the user after adding the folder
                contr.addFolder(addFolderName, addFolderDesc, addFolderEggType);
            } catch (e:any) {
                error = e.messgae;
            }
            break;
        case "setFolder":
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
                // CHECK: what are we returning back to the user after setting the folder
                contr.setFolder(setFolderName, setFolderNewName, setFolderDesc);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "deleteFolder":
            const delFolderName = req.body.name;
            if (typeof(delFolderName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            try {
                // CHECK: what are we returning back to the user after setting the folder
                contr.deleteFolder(delFolderName);
            } catch (e:any){
                error = e.message;
            }
            break;
        case "addTask":
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
            if (addTaskStart !== undefined && !checkDateTime(addTaskStart)) {
                error = "The type of the start Date is not a DateTime but is defined";
                break;
            }
            const addTaskCycle = req.body.cycleDuration;
            if (addTaskCycle !== undefined && !checkDuration(addTaskCycle)) {
                error = "The type of the cycle Duration is not a Duration but is defined";
                break;
            }
            const addTaskDeadline = req.body.deadline;
            if (addTaskDeadline !== undefined && !checkDateTime(addTaskDeadline)) {
                error = "The type of the deadline is not a DateTime but is defined";
                break;
            }
            try {
                result = "" + contr.addTask(addTaskFoldName, addTaskName, addTaskDesc,
                                            addTaskTags, addTaskShared, addTaskStart,
                                            addTaskCycle, addTaskDeadline);
            } catch (e:any){
                error = e.message;
            }
            break;
        case "setTask":
            const setTaskFoldName = req.body.folderName;
            if (typeof(setTaskFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const setTaskId = req.body.id;
            if (!checkTaskID(setTaskId)) {
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
            if (setTaskStart !== undefined && !checkDateTime(setTaskStart)) {
                error = "The type of the start Date is not a DateTime but is defined";
                break;
            }
            const setTaskCycle = req.body.cycleDuration;
            if (setTaskCycle !== undefined && !checkDuration(setTaskCycle)) {
                error = "The type of the cycle Duration is not a Duration but is defined";
                break;
            }
            const setTaskDeadline = req.body.deadline;
            if (setTaskDeadline !== undefined && !checkDateTime(setTaskDeadline)) {
                error = "The type of the deadline is not a DateTime but is defined";
                break;
            }
            try {
                result = "" + contr.setTask(setTaskFoldName, setTaskId, setTaskCompl,
                                            setTaskName, setTaskDesc, setTaskTags,
                                            setTaskShared, setTaskStart, setTaskCycle,
                                            setTaskDeadline);
            } catch (e:any){
                error = e.message;
            }
            break;
        case "deleteTask":
            const delTaskFoldName = req.body.folderName;
            if (typeof(delTaskFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const delTaskID = req.body.id;
            if (!checkTaskID(delTaskID)) {
                error = "The id is undefined or is not a string";
                break;
            }
            try {
                contr.deleteTask(delTaskFoldName, delTaskID);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "addUnivCredits":
            const addUCred = req.body.amount;
            if (typeof(addUCred) !== 'number') {
                error = "The amount is undefined or is not a number";
                break;
            }
            try {
                contr.addUnivCredits(addUCred);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "removeUnivCredits":
            const remUCred = req.body.amount;
            if (typeof(remUCred) !== 'number') {
                error = "The amount is undefined or is not a number";
                break;
            }
            try {
                contr.removeUnivCredits(remUCred);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "addEggCredits":
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
                contr.addEggCredits(addAmount, addEggCredFoldName);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "removeEggCredits":
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
                contr.removeEggCredits(remAmount, remEggCredFoldName);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "buyAccessory":
            const AccessFoldName = req.body.folderName;
            if (typeof(AccessFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const AccessType = req.body.accesssoryType;
            if (typeof(AccessType) !== 'string') {
                error = "The type of the accesssory is undefined or is not a string";
                break;
            }
            try {
                result = "" + contr.buyAccessory(AccessFoldName, AccessType);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "buyInteraction":
            const InterFoldName = req.body.folderName;
            if (typeof(InterFoldName) !== 'string') {
                error = "The name of the folder is undefined or is not a string";
                break;
            }
            const InterType = req.body.accesssoryType;
            if (typeof(InterType) !== 'string') {
                error = "The type of the interaction is undefined or is not a string";
                break;
            }
            try {
                result = "" + contr.buyInteraction(InterFoldName, InterType);
            } catch (e:any) {
                error = e.message;
            }
            break;
        case "gainExp":
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
                contr.gainExp(expAmount, expFoldName);
            } catch (e:any) {
                error = e.message;
            }
            break;
        default:
            error = "The function of the request is not defined";
    }
    // There is some functions that doesn't return anything
    // making result = "". CHECK: what to return for those function.
    res.send(result);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

