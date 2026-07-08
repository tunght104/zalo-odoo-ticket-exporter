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
  selectedAt: number;
  /** Extracted sender name */
  senderName?: string;
}

/**
 * Options passed to SidebarManager during construction.
 */
export interface SidebarOptions {
  onClear: () => void;
}

// ─── Odoo Integration Types ───────────────────────────────────────────────────

/**
 * Payload sent from Content Script to Service Worker to create an Odoo ticket.
 */
export interface OdooTicketPayload {
  // Ticket title
  title: string;
  // Ticket description
  description: string;
  // Customer name (res.partner)
  customerName: string;
  // Customer phone number
  phone: string;
  // Customer email
  email: string;
  // List of tag names (helpdesk.tag)
  tagNames: string[];
  // Conversation text formatted as plain text
  conversationText: string;
  // Whether to mark the ticket as solved or in progress
  markAsSolved: boolean;
}

/**
 * Response from Service Worker after attempting to create an Odoo ticket.
 */
export interface OdooTicketResult {
  success: boolean;
  ticketId?: number;
  // "NOT_LOGGED_IN" or error message from Odoo
  error?: string;
}

/**
 * Odoo credentials stored in chrome.storage.local.
 */
export interface OdooCredentials {
  odooEmail: string;
  odooApiKey: string;
}
