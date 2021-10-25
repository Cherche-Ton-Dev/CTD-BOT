import { IButtonList } from "../types/buttons";

import * as validateMission from "./validate-mission";
import * as declineMission from "./decline-mission";
import * as createMission from "./create-mission";
import * as acceptMission from "./accept-mission";

export { handleButtonPress } from "./handleButtonPress";
export const commands: IButtonList = {
    "create-mission": createMission,
    accept: acceptMission,
    validate: validateMission,
    decline: declineMission,
};
