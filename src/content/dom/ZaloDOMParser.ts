import { ZALO_SELECTORS } from "../../shared/constants";

/**
 * Structured data parsed from a single Zalo chat item DOM element.
 */
export interface ParsedChatItem {
  element: HTMLElement;
  text: string;
  isMe: boolean;
}

/**
 * Abstracts all Zalo-specific DOM queries and parsing.
 * When Zalo changes their class names or structure, only this file needs updating.
 */
export class ZaloDOMParser {
  /**
   * Get all chat item elements currently in the DOM.
   */
  getAllChatItems(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(ZALO_SELECTORS.CHAT_ITEMS);
  }

  /**
   * Extract clean message text from a .chat-content element.
   * Removes Zalo's timestamp suffix and reactions.
   */
  extractCleanText(chatContent: HTMLElement): string {
    // 1. Try to target only the text content container to avoid quotes/reactions
    const textEl = chatContent.querySelector('[data-component="message-text-content"]');
    if (textEl) {
      return (textEl as HTMLElement).innerText?.trim() ?? "";
    }

    // 2. Fallback to extracting from the entire chatContent if specific container is not found
    let text = chatContent.innerText?.trim() ?? "";
    if (!text) return "";

    // Zalo's timestamp is usually on a new line like "\n16:09" or "\n16:"
    // Remove the timestamp and everything after it (reactions, etc.)
    text = text.replace(/\n\d{1,2}:\d{2}[\s\S]*$/, "");

    // Fallback for cut-off timestamps like "\n16:"
    text = text.replace(/\n\d{1,2}:[\s\S]*$/, "");

    return text.trim();
  }

  /**
   * Parse a chat item DOM element into structured data.
   * Returns null if the element doesn't contain valid message content.
   */
  parseChatItem(item: HTMLElement): ParsedChatItem | null {
    const chatContent = item.querySelector<HTMLElement>(ZALO_SELECTORS.CHAT_CONTENT);
    if (!chatContent) return null;

    const text = this.extractCleanText(chatContent);
    if (!text) return null;

    return {
      element: item,
      text,
      isMe: item.classList.contains(ZALO_SELECTORS.ME_CLASS),
    };
  }

  /**
   * Generate a unique ID for a message based on sender type and full text hash.
   *
   * Uses a hash of the full text (not just first 30 chars) to minimize
   * collisions between different messages.
   */
  generateMessageId(isMe: boolean, text: string): string {
    const prefix = isMe ? "me" : "cus";
    const hash = this.simpleHash(text);
    return `msg-${prefix}-${hash}`;
  }

  getCurrentConversationKey(): string {
    // Find the selected user/group in the left column
    const selectedItem = document.querySelector(".conv-item.selected");
    if (selectedItem) {
      // Try to get the unique ID of that person
      const msgItem = selectedItem.closest(".msg-item");
      if (msgItem) {
        const id = msgItem.getAttribute("anim-data-id");
        if (id) return id;
      }

      // Fallback: Get the name of that person
      const nameEl = selectedItem.querySelector(".conv-item-title__name");
      if (nameEl) {
        return nameEl.textContent || window.location.href;
      }
    }

    // If not found, fallback to URL
    return window.location.href;
  }

  /**
   * Simple 32-bit hash of a string, returned as base-36.
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}
