import { SelectedMessage } from "../../shared/types";

/**
 * Handles formatting selected messages for preview and clipboard export.
 * Pure logic — no DOM side effects.
 */
export class MessageFormatter {
  /**
   * Format messages into a plain text conversation string for clipboard.
   */
  formatAsText(messages: SelectedMessage[], meLabel: string, customerLabel: string): string {
    const sorted = [...messages].sort((a, b) => a.selectedAt - b.selectedAt);
    return sorted
      .map((msg) => {
        const label = msg.senderType === "me" ? meLabel : (msg.senderName || customerLabel);
        return `${label}: ${msg.text}`;
      })
      .join("\n");
  }

  /**
   * Format messages into HTML for the sidebar preview panel.
   */
  formatAsHtml(messages: SelectedMessage[], meLabel: string, customerLabel: string): string {
    const sorted = [...messages].sort((a, b) => a.selectedAt - b.selectedAt);
    return sorted
      .map((msg) => {
        const isMe = msg.senderType === "me";
        const senderClass = isMe ? "zme-sender-me" : "zme-sender-customer";
        const label = isMe ? meLabel : (msg.senderName || customerLabel);
        const text = this.escapeHtml(msg.text);
        return `<div class="zme-preview-line"><span class="${senderClass}">${label}</span>: ${text}</div>`;
      })
      .join("");
  }

  /**
   * Escape HTML special characters to prevent XSS in innerHTML.
   */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}
