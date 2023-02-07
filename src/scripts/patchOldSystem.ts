import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import { connectDB } from "$db/init";
import { Mission } from "$db/schemas/mission";

connectDB().then(() => {
    // channel dev
    const patches = [
        ["1002908764573286400", "1002579278141079572"],
        ["997367160877887499", "837449142665084929"],
        ["995479977246076978", "700374770276892808"],
        ["988367653888483378", "869888067736076299"],
    ];

    for (const [channeID, devID] of patches) {
        Mission.findOneAndUpdate(
            {
                channel: channeID,
            },
            {
                offer: {
                    devDiscordID: devID,
                },
            },
            {
                new: true,
            },
        ).then((doc) => console.log("patched", doc));
    }
});
