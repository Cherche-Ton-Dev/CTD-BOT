import { Mission } from "../schemas/mission";

export async function validateMission(id: string) {
    return Mission.findByIdAndUpdate(id, {
        accepted: true,
    });
}
export async function declineMission(id: string) {
    return Mission.findByIdAndDelete(id);
}
