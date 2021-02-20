export interface Settings {
  //// SETUP ////

  /**
   * Matrix Homeserver
   *  Eg. "https://matrix-federation.matrix.org"
   */
  homeserverUrl: string;
  /**
   * Matrix User ID of the bot account
   */
  matrixUserId: string;
  /**
   * Access Token of the bot account
   *   See https://t2bot.io/docs/access_tokens/ for a simple way to generate
   */
  matrixAccessToken: string;
  /**
   * File used as temporary storage by the bot
   *   Defaults to `bot-storage.json`
   */
  storageFile?: string;

  //// OPERATIONS ////

  /**
   * Dry run indicates that no messages will be sent or deleted in Matrix
   *   Defaults to `false`
   */
  dryRun?: boolean;
  /**
   * Frequency of the bot polling Matrix messages (in seconds)
   */
  pollFrequency: number;
  /**
   * Should the bot auto accept invites to rooms?
   *   Defaults to `false`
   */
  autoJoin?: boolean;

  //// CUSTOMIZATION ////

  /**
   * Time limit before deleting Matrix messages (in seconds)
   */
  messageTimeLimit: number;
}

export type SettingsWithDefaults = Required<Settings>;
