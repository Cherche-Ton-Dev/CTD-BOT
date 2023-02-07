// const requiredRole = config.devRoles.find(
//     (role) => role.value === mission.target,
// );

// if (
//     !(interaction.member as GuildMember).roles.cache.some(
//         (role) => role.id === requiredRole?.roleID,
//     )
// ) {
//     interaction.reply({
//         embeds: [
//             {
//                 title: "Erreur",
//                 description: `Tu n'as pas le role ${requiredRole?.label}`,
//                 color: "RED",
//             },
//         ],
//         components: [
//             {
//                 type: "ACTION_ROW",
//                 components: [
//                     {
//                         type: "BUTTON",
//                         label: "Obtenir le role",
//                         style: "SUCCESS",
//                         customId: "get-role",
//                     },
//                 ],
//             },
//         ],
//         ephemeral: true,
//     });

//     interaction.channel
//         ?.awaitMessageComponent({
//             filter: (buttonInteraction) =>
//                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                 // @ts-ignore
//                 buttonInteraction.member?.id === interaction.member?.id &&
//                 buttonInteraction.component?.type === "BUTTON" &&
//                 buttonInteraction.component.label === "Obtenir le role",
//         })
//         .then(async (buttonInteraction) => {
//             if (!buttonInteraction.member) return;

//             await buttonInteraction.deferReply({
//                 ephemeral: true,
//             });
//             const DBMember = await createOrGetMember(
//                 buttonInteraction.member as GuildMember,
//             );
//             if (DBMember.roleTicketPending)
//                 return await buttonInteraction.editReply({
//                     embeds: [
//                         {
//                             title: "Erreur",
//                             description:
//                                 "Tu as déjà un ticket de role ouvert, si ce n'est pas le cas, fais en part aux modérateurs",
//                             color: "RED",
//                         },
//                     ],
//                 });
//             DBMember.roleTicketPending = true;
//             DBMember.save();
//             const channel = await createTicket(
//                 interaction.member as GuildMember,
//                 `${interaction.member?.user.username}-devenir-${requiredRole?.label}`,
//                 [modoRole.id, interaction.user.id],
//                 config.ticketCategoryId,
//                 [
//                     {
//                         title: "Requête de rôle",
//                         description: `${interaction.member?.user.username} souhaite devenir ${requiredRole?.label}`,
//                         color: "BLUE",
//                     },
//                 ],
//                 [
//                     {
//                         type: "ACTION_ROW",
//                         components: [
//                             {
//                                 type: "BUTTON",
//                                 style: "SUCCESS",
//                                 label: "Accepter",
//                                 customId: `event-give-role-{${interaction.member?.user.id},${requiredRole?.roleID}}`,
//                             },
//                             {
//                                 type: "BUTTON",
//                                 style: "DANGER",
//                                 label: "Refuser",
//                                 customId: `event-refuse-role-{${interaction.member?.user.id},${requiredRole?.roleID}}`,
//                             },
//                         ],
//                     },
//                 ],
//             );
//             channel.send(
//                 `Bonjour ${interaction.member}, les <@&${
//                     requiredRole?.value == "artist"
//                         ? config.respArtistRoleId
//                         : config.respDevRoleId
//                 }> vont verifier tes competences.\nEst ce que tu pourrais presenter quelques uns de tes projets/creations, \n${
//                     requiredRole?.value == "artist"
//                         ? "ton portfolio si tu en as un ?"
//                         : "ton github / gitlab / portfolio ?"
//                 }`,
//             );
//             await buttonInteraction.editReply({
//                 embeds: [
//                     {
//                         title: "Ticket crée.",
//                         description: `Va dans ton ticket ${channel} pour demander le role`,
//                         color: "GREEN",
//                     },
//                 ],
//             });
//         });

//     return {
//         status: "ERROR",
//         label: "missing role for accept",
//     };
// }
