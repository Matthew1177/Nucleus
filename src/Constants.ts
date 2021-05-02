export const GUILD_SETTINGS_LIFETIME = 5 * 60 * 1000;
export const PERMISSIONS_SETTINGS_LIFETIME = 5 * 60 * 1000;
export const REGEX = {
  MENTION: /(?<=^<@!?)\d+(?=>$)/,
  SNOWFLAKE: /^\d+$/,
  UUID: /^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b$/,
};

export const COLORS = {
  BLURPLE: 0x7289da,
  FULL_WHITE: 0xffffff,
  GREYPLE: 0x99aab5,
  DARK_BUT_NOT_BLACK: 0x2c2f33,
  NOT_QUITE_BLACK: 0x23272a,
  ACTUALLY_BLACK: 0x000000,
};

export const NCS = {
  WHITE: 0xffffff,
  BLACK: 0x000000,
  GREEN: 0x009f6b,
  RED: 0xc40233,
  YELLOW: 0xffd300,
  BLUE: 0x0087bd,
};
