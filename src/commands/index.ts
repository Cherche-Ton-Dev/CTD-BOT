import { ICommandList } from "types/commands";

import * as suggest from "./suggest";
import * as finish from "./finish";
import * as moyenne from "./moyenne";
import * as ticket from "./ticket";
import * as contrib from "./contrib";
import * as lead from "./lead";
import * as offer from "./offer";
import gestion from "./gestion/index";

export const commands: ICommandList = {
    gestion,
    suggest,
    moyenne,
    ticket,
    finish,
    contrib,
    lead,
    offer,
};
