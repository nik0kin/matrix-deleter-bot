# matrix-deleter-bot

Deletes messages in all joined matrix rooms after a given time limit (24h) to simulate Snapchat/Instagram-stories limited duration messages.

Currently the time limit is per bot, but could be expanded to per room with additional work to the project.

The bot account must have privileges to delete messages in a given room.

## Use MSC-1763

Ah, it look's like a bot isn't needed for this functionality. MSC-1763 describes a spec for "configurable per-room message retention periods" See [proposed spec](https://github.com/matrix-org/matrix-doc/blob/matthew/msc1763/proposals/1763-configurable-retention-periods.md). See [synapse config for room message rentention](https://github.com/matrix-org/synapse/blob/develop/docs/message_retention_policies.md#room-configuration)

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

