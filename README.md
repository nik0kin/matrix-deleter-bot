# matrix-deleter-bot

Deletes messages in all joined matrix rooms after a given time limit (24h) to simulate Snapchat/Instagram-stories limited duration messages.

Currently the time limit is per bot, but could be expanded to per room with additional work to the project.

The bot account must have privileges to delete messages in a given room.

## Develop

```
yarn install
yarn dev
```

## Run

### Bootstrap mode

```
# clone repo
yarn install

cp bot-config.sample.json bot-config.json
# configure bot-config.json

yarn global add pm2
pm2 start pm2.config.js
```

### As a Node.js package

```
yarn add matrix-deleter-bot
```

```
import { startBot } from 'matrix-deleter-bot';

const config = {
  // see bot-config.sample.json
};

startBot(config);
```

## Config

See [settings.ts](./src/settings.ts) for config descriptions

