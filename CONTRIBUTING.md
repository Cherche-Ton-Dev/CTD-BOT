# CONTRIBUTING

Bienvenue dans le guide de contribution du bot CTD

En cas de problème nous sommes disponibles pour répondre a toutes vos questions sur le serveur CTD

## SUMMARY

- [CONTRIBUTING](#contributing)
  - [SUMMARY](#summary)
  - [Installation des outils](#installation-des-outils)
    - [MongoDB](#mongodb)
  - [Getting started](#getting-started)
    - [Mise en place](#mise-en-place)
    - [Configuration d'un serveur de test](#configuration-dun-serveur-de-test)
      - [Créer le bot](#créer-le-bot)
      - [Connexion au bot, db et serveur](#connexion-au-bot-db-et-serveur)
      - [Synchronisez les commandes](#synchronisez-les-commandes)
      - [Lancer le bot](#lancer-le-bot)

## Installation des outils

Pour développer le bot vous aurez besoin de certains outils:

-   [git](https://git-scm.com/downloads)
    -   Permets la synchronisation du code et la collaboration
    -   pensez a cocher la case **add to path**
-   [node](https://nodejs.org/en/)
    -   Téléchargez la derrière version (>= 18)
-   [yarn](https://yarnpkg.com/getting-started/install)
    -   Permets le téléchargement de modules

> NOTE: Merci de ne pas utiliser npm, nous préférons yarn

### MongoDB

Pour metre en place la base de donees vous avez deux options:

1. Installer mongoDB localement (https://www.mongodb.com/try/download/community), [guide d'installation](https://treehouse.github.io/installation-guides/windows/mongo-windows.html)
2. Utiliser un compte mongoDB atlas pour avoir la DB dans le cloud (https://account.mongodb.com/account/register) [guide](https://www.mongodb.com/docs/atlas/getting-started/)

## Getting started

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
