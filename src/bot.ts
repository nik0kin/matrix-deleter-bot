/* eslint-disable no-console */
import * as sdk from 'matrix-js-sdk';

import { Settings, SettingsWithDefaults } from './settings';
// import { createMatrixClient } from './matrix-bot';

async function poll(
  settings: SettingsWithDefaults /*, botClient: MatrixClient*/
) {
  try {
    await checkMessageLimitsAndDelete(settings /*, botClient*/);
  } catch (e) {
    console.error('Something went wrong polling', e);
  }
  setPollTimeout(settings /*, botClient*/);
}

function setPollTimeout(
  settings: SettingsWithDefaults /*,
  botClient: MatrixClient*/
) {
  setTimeout(() => {
    poll(settings /*, botClient*/);
  }, settings.pollFrequency * 1000);
}

async function checkMessageLimitsAndDelete(
  settings: SettingsWithDefaults /*,
  botClient: MatrixClient*/
) {
  // TODO
  // for each room the bot's in
  //   load all messages in room
  //   for each message
  //     if the message is over 24 hours (messageTimeLimit)
  //       delete message

  const matrixClient = sdk.createClient({
    baseUrl: settings.homeserverUrl,
    accessToken: settings.matrixAccessToken,
    userId: settings.matrixUserId,
  });

  matrixClient.on('Room.timeline', function (
    event: any,
    room: any
    // toStartOfTimeline: boolean
  ) {
    // if (toStartOfTimeline) {
    //   return; // don't print paginated results
    // }
    if (event.getType() !== 'm.room.message') {
      return; // only print messages
    }
    console.log(
      // the room name will update with m.room.name events automatically
      '(%s) %s :: %s - %s',
      room.name,
      event.getSender(),
      event.getContent().body,
      ''
    );

    if (
      event.getLocalAge() > settings.messageTimeLimit * 1000 &&
      event.getContent().body
    ) {
      console.log('Delete message', event.getId());
      matrixClient.redactEvent(room.id, event.getId(), event.getTxnId());
    }
  });

  matrixClient.startClient();

  setTimeout(() => {
    matrixClient.stopClient();
  }, (settings.pollFrequency * 1000) / 2);
}

/**
 * Starts the Matrix bot
 */
export async function startBot(userSettings: Settings) {
  const settings: SettingsWithDefaults = {
    storageFile: 'bot-storage.json',
    dryRun: false,
    autoJoin: false,
    ...userSettings,
  };

  // Connect to Matrix
  // const botClient = createMatrixClient(settings);
  // await botClient.start();

  poll(settings /*, botClient*/);
}
