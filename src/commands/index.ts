import { ICommandList } from "../types/commands";

import * as suggest from "./suggest";
import * as ticket from "./ticket";
import admin from "./admin/index";
import gestion from "./gestion/index";

export const commands: ICommandList = {
    // admin,
    gestion,
    suggest,
    ticket,
};
