import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { UserID } from "../types/UserID";
import { IDManager } from "../model/IDManager";
import { UserManager } from "../model/UserManager";
import { EggManager } from "../model/EggManager";
import { WriteManager } from "../model/WriteManager";
import { ModelController } from "../ModelController";
import { ModelView } from "../ModelView";

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
    // url: http://localhost:3000/view?func=NULL&arg1=NULL&arg2=NULL
    let request = req.query;
    let resultString = "";
    let body = "";
    let httpResp = okResp;
    switch(request.func) {
        case "getUserInfo":
            // change UserID to actual user id string returned by signup
            // http://localhost:3000/view?func=getUserInfo&arg1=UserID
            const idStr = request.arg1;
            if (typeof idStr !== "string") {
                httpResp = badReq;
                break;
            }
            const userID: UserID = {
                id: idStr
            }
            body += viewer.getUserInfo(userID);
            break;
        default:
            httpResp = badReq;
    }
    resultString += httpResp + newline + newline + body;
    res.send(resultString);
});

// // for login methods
// app.get("/login", (req: Request, res: Response) => {
//     // url: http://localhost:3000/login?func=NULL&arg1=NULL&arg2=NULL
//     let request = req.query;
//     let resultString = "";
//     switch(request.func) {
//         case "login":
//             // code
//             break;
//     }
//     resultString += okResp + newline + newline;
//     res.send(resultString);
// });

// for controller methods
app.get("/controller", (req: Request, res: Response) => {
    // url: http://localhost:3000/controller?func=NULL&arg1=NULL&arg2=NULL
    let request = req.query;
    let resultString = "";
    let body = "";
    let httpResp = okResp;
    switch(request.func) {
        case "signup":
            // http://localhost:3000/controller?func=signup&arg1=khai&arg2=password
            const username = request.arg1;
            if (typeof username !== "string") {
                httpResp = badReq;
                break;
            }
            const password = request.arg2;
            if (typeof password !== "string") {
                httpResp = badReq;
                break;
            }
            try {
                // request['username']
                body += contr.signup(username, password);
            } catch (e: any) {
                httpResp = badReq;
                body += e;
            }
            break;
        default:
            httpResp = badReq;
    }
    resultString += httpResp + newline + newline + body;
    res.send(resultString);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});