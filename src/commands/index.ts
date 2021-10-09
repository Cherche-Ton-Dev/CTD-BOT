import { ICommandList } from "../types/commands";

import * as suggest from "./suggest";
import admin from "./admin/index";

export const commands: ICommandList = {
    admin,
    suggest: suggest,
};
