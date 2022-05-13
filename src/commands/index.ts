import { ICommandList } from "../types/commands";

import * as suggest from "./suggest";
import * as finish from "./finish";
import * as moyenne from "./moyenne";
import * as ticket from "./ticket";
import * as contrib from "./contrib";
import admin from "./admin/index";
import gestion from "./gestion/index";

export const commands: ICommandList = {
    // admin,
    gestion,
    suggest,
    moyenne,
    ticket,
    finish,
    contrib,
};
