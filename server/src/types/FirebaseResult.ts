import { Task } from "../model/Task";
import { User } from "../model/User";

export type Result = {
    status: boolean,
    content: string | User | Task | undefined
};