# CONTRIBUTING

Bienvenue dans le guide de contribution du bot CTD

En cas de problème nous sommes disponibles pour répondre a toutes vos questions sur le serveur CTD

## SUMMARY

- [CONTRIBUTING](#contributing)
  - [SUMMARY](#summary)
  - [Getting started](#getting-started)
    - [Installation des outils](#installation-des-outils)
      - [MongoDB](#mongodb)
    - [Mise en place](#mise-en-place)
    - [Configuration d'un serveur de test](#configuration-dun-serveur-de-test)
      - [Créer le bot](#créer-le-bot)
      - [Connexion au bot, db et serveur](#connexion-au-bot-db-et-serveur)
      - [Synchronisez les commandes](#synchronisez-les-commandes)
      - [Lancer le bot](#lancer-le-bot)
  - [Style de code](#style-de-code)
    - [Utilisation de async await](#utilisation-de-async-await)
    - [Pas de builders discord > options](#pas-de-builders-discord--options)
    - [utilisation de const, var et let avec parcimonie](#utilisation-de-const-var-et-let-avec-parcimonie)
  - [Structure du projet](#structure-du-projet)

## Getting started

### Installation des outils

Pour développer le bot vous aurez besoin de certains outils:

-   [git](https://git-scm.com/downloads)
    -   Permets la synchronisation du code et la collaboration
    -   pensez a cocher la case **add to path**
-   [node](https://nodejs.org/en/)
    -   Téléchargez la derrière version (>= 18)
-   [yarn](https://yarnpkg.com/getting-started/install)
    -   Permets le téléchargement de modules

> NOTE: Merci de ne pas utiliser npm, nous préférons yarn

#### MongoDB

Pour metre en place la base de donees vous avez deux options:

1. Installer mongoDB localement (https://www.mongodb.com/try/download/community), [guide d'installation](https://treehouse.github.io/installation-guides/windows/mongo-windows.html)
2. Utiliser un compte mongoDB atlas pour avoir la DB dans le cloud (https://account.mongodb.com/account/register) [guide](https://www.mongodb.com/docs/atlas/getting-started/)

### Mise en place

Une fois que vous avez tous les outils nécessaires il faut récupérer le code avec `git`

```console
git clone https://github.com/rafalou38/CTD-BOT.git
```

puis installer tous les modules

```console
cd CTD-BOT
yarn
```

### Configuration d'un serveur de test

#### Créer le bot

Rendez vous dans cette url https://discord.com/developers/applications pour créer une application puis un bot, récupérez le token, l'ID de l'application

Pour inviter le bot rendez vous dans OAuth2>URL generator puis sélectionnez les scopes bot ainsi que application.commands puis la permission administrateur, finalement ouvrez l'url et invitez le dans votre serveur.

#### Connexion au bot, db et serveur

créez le fichier `.env` avec le contenu

```
BOT_TOKEN=
APP_ID=
GUILD_ID=
MONGO_URI=
```

puis renseignez les valeurs

-   BOT_TOKEN: trouvez le dans le panel discord (onglet bot)
-   APP_ID: trouvez le dans le panel discord (onglet general information)
-   GUILD_ID: l'ID de votre serveur discord
-   MONGO_URI:
    -   mongoDB atlas: Récupérez la sur ou si vous utilisez la
    -   version locale: utilisez `mongodb://127.0.0.1:27017/ctd`

puis modifiez le fichier [/src/context/config.ts](/src/context/config.ts), renseignez les identifiants des différents salons et roles de votre serveur

#### Synchronisez les commandes

exécutez la commande

```
yarn push
```

> Cette commande peut metre un peu de temps avant de s’exécuter

Si tout a été configuré correctement vous devriez voir apparaître un long texte json suivit de

```
Is it ok? (y|n)
>
```

tapez `y` vous devriez voir apparaître

```
Successfully pushed.
```

Si ce n'est pas le cas venez sur le serveur CTD nous serons ravis de vous assister.

#### Lancer le bot

Finalement exécutez la commande

```
yarn dev
```

si vous voyez

```
12/08/2022 16:14:51 ✅ connecté a mongoDB 🌳
12/08/2022 16:14:52 🤖 Bot CTD-Bot#1996 successfully started 🚀
```

tout est bon!

## Style de code

### Utilisation de async await

❌ Mauvais

```js
guild.members.fetch().then((members) => {
    // code
    guild.channels.fetch().then((channels) => {
        // code
        message.reply("test").then(() => {
            // code
        });
    });
    // code
});
```

✅ Bon

```js
const members = await guild.members.fetch();
// code
const channels = await guild.channels.fetch();
// code
await message.reply("test");
// code
```

### Pas de builders discord > options

❌ Mauvais

```js
const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Some title")
    .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
    })
    .setDescription("Some description here")
    .setThumbnail("https://i.imgur.com/AfFp7pu.png")
    .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
    )
    .setImage("https://i.imgur.com/AfFp7pu.png");
```

✅ Bon

```js
const exampleEmbedOptions: MessageEmbedOptions = {
    title: "Some title",
    description: "Some description here",
    thumbnail: { url: "https://i.imgur.com/AfFp7pu.png" },
    image: { url: "https://i.imgur.com/AfFp7pu.png" },
    fields: [
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
    ],
    author: {
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
    },
    color: 0x0099ff,
};
```

### utilisation de const, var et let avec parcimonie

## Structure du projet
