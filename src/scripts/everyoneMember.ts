import { Client, IntentsBitField } from "discord.js";

const client = new Client({
    intents: [IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildModeration],
});

client.on("ready", async () => {
    const guild = client.guilds.cache.get("934916134313033848");

    console.log(">> Obtention des membres...");
    let members = await guild?.members.fetch();

    if (!members) {
        console.log(">> Erreur lors de l'obtention des membres");
        process.exit(0);
    }
    console.log(`>> ${members?.size} membres trouvés.`);

    members = members?.filter((member) => {
        // @ts-ignore
        return !member._roles.includes("934916134313033852");
    });
    console.log(`>> ${members?.size} Sans le role.`);

    for (const member of members.values()) {
        console.log(member.user.tag);
        // await member.roles.add("934916134313033852");
    }

    process.exit(0);
});

client.login("");
