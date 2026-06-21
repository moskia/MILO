// User-facing toggles, stored alongside notes in chrome.storage.local.

export interface Settings {
  /** Show the floating Capture button when text is selected. */
  captureOnSelect: boolean;
}

const DEFAULTS: Settings = {
  captureOnSelect: true,
};

export const SettingsRepository = {
  async get(): Promise<Settings> {
    const result = await chrome.storage.local.get(DEFAULTS);
    return { ...DEFAULTS, ...result } as Settings;
  },

  async set(patch: Partial<Settings>): Promise<void> {
    await chrome.storage.local.set(patch);
  },
};
