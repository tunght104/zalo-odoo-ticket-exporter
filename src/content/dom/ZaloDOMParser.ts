import { ZALO_SELECTORS, SORT_INDEX_BLOCK_MULTIPLIER } from "../../shared/constants";

/**
 * Parsed result from a Zalo chat item DOM element.
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

  /**
   * Compute a sort index for maintaining conversation order.
   *
   * Strategy: Use the element's absolute pixel position within the scroll
   * container. Virtual lists (like Zalo's) position items absolutely within
   * a tall container — so `offsetTop` reflects the true position in the full
   * conversation, not just the current viewport.
   *
   * Fallback: If we can't determine absolute position, use block-date
   * hierarchy (block index × multiplier + item index).
   */
  getDomSortIndex(chatItem: HTMLElement): number {
    // Strategy 1: Absolute position in scroll container
    // Walk up to find the nearest scrollable ancestor with a large scrollHeight
    const absoluteTop = this.getAbsoluteTop(chatItem);
    if (absoluteTop !== null) {
      return absoluteTop;
    }

    // Strategy 2: Fallback to block-date hierarchy
    const blockDate = chatItem.closest(ZALO_SELECTORS.BLOCK_DATE);
    if (!blockDate) return 0;

    const allBlocks = Array.from(document.querySelectorAll(ZALO_SELECTORS.BLOCK_DATE));
    const blockIndex = allBlocks.indexOf(blockDate as Element);

    const itemsInBlock = Array.from(blockDate.querySelectorAll(ZALO_SELECTORS.CHAT_ITEMS.split(" ").pop()!));
    const itemIndex = itemsInBlock.indexOf(chatItem);

    return blockIndex * SORT_INDEX_BLOCK_MULTIPLIER + itemIndex;
  }

  /**
   * Get the element's absolute top position within its scrollable container.
   * Returns null if no suitable container is found.
   */
  private getAbsoluteTop(element: HTMLElement): number | null {
    // Walk up to find a scrollable container (the chat message list)
    let container: HTMLElement | null = element.parentElement;
    while (container) {
      // A scroll container typically has scrollHeight much larger than clientHeight
      if (container.scrollHeight > container.clientHeight * 1.5) {
        // Calculate element's position relative to this container
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        // Absolute position = visual offset from container top + how far we've scrolled
        return (elementRect.top - containerRect.top) + container.scrollTop;
      }
      container = container.parentElement;
    }
    return null;
  }

  /**
   * Get the current conversation identifier (URL-based).
   */
  getCurrentConversationKey(): string {
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
