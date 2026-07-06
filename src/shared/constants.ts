// ─── DOM Element IDs ──────────────────────────────────────────────────────────
export const SIDEBAR_ID = "zme-sidebar";
export const TOGGLE_BTN_ID = "zme-toggle-btn";
export const TOAST_ID = "zme-toast";
export const STYLES_ID = "zme-styles";

// ─── Zalo DOM Selectors ───────────────────────────────────────────────────────
export const ZALO_SELECTORS = {
  /** Selector for individual chat message items */
  CHAT_ITEMS: ".block-date .chat-item",
  /** Selector for the text content container within a chat item */
  CHAT_CONTENT: ".chat-content",
  /** Class name indicating a message sent by "me" */
  ME_CLASS: "me",
  /** Selector for date block containers (used for sort ordering) */
  BLOCK_DATE: ".block-date",
} as const;

// ─── CSS Class Names ──────────────────────────────────────────────────────────
export const CSS_CLASSES = {
  SELECT_MODE: "zme-select-mode",
  SELECTED: "zme-selected",
  SIDEBAR_OPEN: "zme-open",
  TOGGLE_ACTIVE: "zme-active",
  COPIED: "zme-copied",
  TOAST_SHOW: "zme-show",
} as const;

// ─── Timing (milliseconds) ───────────────────────────────────────────────────
/** Delay before initializing the extension (wait for Zalo to load) */
export const INIT_DELAY_MS = 1500;
/** Delay before setting up DOM observers (wait for chat area to render) */
export const OBSERVER_SETUP_DELAY_MS = 2000;
/** How long a toast notification stays visible */
export const TOAST_DURATION_MS = 2500;
/** How long the "Copied!" feedback shows on the copy button */
export const COPY_FEEDBACK_DURATION_MS = 2000;
