import chalk from "chalk";
import { Client } from "discord.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const client = new Client({
    intents: ["GuildMembers", "DirectMessages"],
});

client.on("ready", async () => {
    const guild = client.guilds.cache.get("856600670182572062");

    console.log(">> Obtention des membres...");
    let members = await guild?.members.fetch();

    if (!members) {
        console.log(">> Erreur lors de l'obtention des membres");
        process.exit(0);
    }
    console.log(`>> ${members?.size} membres trouvés.`);

    members = members?.filter(
        (member) => member.user.id != "710923917010665533",
    );

    console.log(`>> ${members?.size} après filtrage.`);

    for (const [, member] of members) {
        await delay(1000);
        process.stdout.write("\t>> Envoi du DM à " + member.user.tag + " : ");
        try {
            await member.send(`> *Bonjour à toi cher développeur*
💤 Dernièrement le serveur **Cherche Ton Dev** était devenu inactif.
🥈 C'est pourquoi nous sortons la **seconde version**
💡 Nous essaierons d'être le **plus actif possible** 
🫂 **respectueux** des autres
🤯 Le serveur ne sera pas une **dictature** et pas de **clear** sans réelle raison
💵 Un système de **paiement sécurisé**, **aucune arnaque**
⛲ **Facile à utiliser**

> Nous vous remercions, clients, développeurs et graphistes

Voici votre entrée: https://discord.gg/YC4rXDSgBn`);
            process.stdout.write(chalk.green("OK.\n"));
        } catch (error) {
            process.stdout.write(chalk.red("FAIL.\n"));
        }
    }

    client.destroy();
    process.exit(0);
});

client.login("");
