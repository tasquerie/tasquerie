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
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});