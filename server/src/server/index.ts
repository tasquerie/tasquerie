import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("all my fellas");
});

app.get("/user", (req: Request, res: Response) => {
    res.send(req.query);
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

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});