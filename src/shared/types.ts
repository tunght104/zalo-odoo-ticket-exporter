/**
 * Represents a message selected by the user for export.
 */
export interface SelectedMessage {
  /** Unique identifier based on sender type + text hash */
  id: string;
  /** Whether the message was sent by "me" or the "customer" */
  senderType: "me" | "customer";
  /** Clean text content of the message */
  text: string;
  /** DOM-based sort index for maintaining conversation order */
  sortIndex: number;
}

/**
 * Options passed to SidebarManager during construction.
 */
export interface SidebarOptions {
  onClear: () => void;
}
