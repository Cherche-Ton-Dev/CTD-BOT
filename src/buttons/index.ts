import { ButtonInteraction, Interaction } from "discord.js";
import { IButtonList } from "../types/buttons";

import * as createMission from "./create-mission";

export { handleButtonPress } from "./handleButtonPress";
export const commands: IButtonList = {
    "create-mission": createMission,
};