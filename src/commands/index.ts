import { ICommandList } from "../types/commands";

import * as suggest from "./suggest";
import admin from "./admin/index";
import gestion from "./gestion/index";

export const commands: ICommandList = {
    // admin,
    gestion,
    suggest: suggest,
};
