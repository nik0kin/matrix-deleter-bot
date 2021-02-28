/* eslint-disable no-console */
import * as sdk from 'matrix-js-sdk';

import { Settings, SettingsWithDefaults } from './settings';
// import { createMatrixClient } from './matrix-bot';

const { EventTimeline, TimelineWindow } = sdk as any;

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

async function checkMessageLimitsAndDelete(settings: SettingsWithDefaults) {
  await new Promise((resolve, reject) => {
    const matrixClient = sdk.createClient({
      baseUrl: settings.homeserverUrl,
      accessToken: settings.matrixAccessToken,
      userId: settings.matrixUserId,
    });

    matrixClient.on('sync', function (state: string) {
      switch (state) {
        case 'ERROR':
          // update UI to say 'Connection Lost'
          reject();
          break;
        case 'SYNCING':
          // update UI to remove any 'Connection Lost' message
          break;
        case 'PREPARED':
          // the client instance is ready to be queried.
          onSyncPrepared(matrixClient, settings).then(() => {
            matrixClient.stopClient();
            resolve();
          });
          break;
      }
    });

    matrixClient.startClient();
  });
}

const WINDOW_SIZE = 1000;

async function onSyncPrepared(
  matrixClient: any,
  settings: SettingsWithDefaults
) {
  for (const room of matrixClient.getRooms()) {
    const timelineWindow = new TimelineWindow(
      matrixClient,
      room.getUnfilteredTimelineSet(),
      {
        windowLimit: WINDOW_SIZE,
      }
    );
    await timelineWindow.load();

    // check current messages then paginate
    await checkRoomMessages(matrixClient, room, timelineWindow, settings);

    let fetchMore = true;
    while (fetchMore && timelineWindow.canPaginate(EventTimeline.BACKWARDS)) {
      const result = await timelineWindow.paginate(
        EventTimeline.BACKWARDS,
        WINDOW_SIZE
      );
      console.log('paginate events fetched:', result);
      fetchMore = result;
      await checkRoomMessages(matrixClient, room, timelineWindow, settings);
    }
  }

  matrixClient.stopClient();
}

async function checkRoomMessages(
  matrixClient: any,
  room: any,
  timelineWindow: any,
  settings: SettingsWithDefaults
) {
  console.log('checkRoomMessages ' + room.roomId);
  for (const event of timelineWindow.getEvents()) {
    await checkMessage(matrixClient, event, room, settings);
  }
}

async function checkMessage(
  matrixClient: any,
  event: any,
  room: any,
  settings: SettingsWithDefaults
) {
  if (event.getType() !== 'm.room.message') {
    // ignore non-messages
    return;
  }
  console.log(
    '(%s) %s :: %s',
    room.name,
    event.getSender(),
    event.getContent().body
  );

  if (
    event.getLocalAge() > settings.messageTimeLimit * 1000 &&
    event.getContent().body
  ) {
    console.log('Delete message', event.getId());
    if (!settings.dryRun) {
      await matrixClient.redactEvent(
        room.roomId,
        event.getId(),
        event.getTxnId()
      );
    }
  }
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
