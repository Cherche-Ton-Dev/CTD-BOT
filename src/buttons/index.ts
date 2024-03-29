import { IButtonList } from "$types/buttons";

import * as validateMission from "./validate-mission";
import * as declineMission from "./decline-mission";
import * as createMission from "./create-mission";
import * as acceptMission from "./accept-mission";
import * as giveRole from "./give-role";
import * as refuseRole from "./refuse-role";
import * as closeTicket from "./close-ticket";
import * as acceptOffer from "./accept-offer";
import * as bumpSquad from "./bumpSquad";

export { handleButtonPress } from "./handleButtonPress";
export const commands: IButtonList = {
    "create-mission": createMission,
    accept: acceptMission,
    validate: validateMission,
    decline: declineMission,
    "give-role": giveRole,
    "refuse-role": refuseRole,
    "close-ticket": closeTicket,
    "accept-offer": acceptOffer,
    "bump-squad": bumpSquad,
};
