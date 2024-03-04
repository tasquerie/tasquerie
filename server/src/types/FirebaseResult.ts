import { Task } from "../model/Task";
import { User } from "../model/User";
import { Accessory } from "./Accessory";
import { EggType } from "./EggType";
import { Interaction } from "./Interaction";

export type Result = {
    status: boolean,
    content: string | User | Task | EggType | Accessory | Interaction | undefined
};