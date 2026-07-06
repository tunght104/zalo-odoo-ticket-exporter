import { SelectedMessage } from "../../shared/types";
import { CSS_CLASSES } from "../../shared/constants";
import { ZaloDOMParser } from "../dom/ZaloDOMParser";

/**
 * Manages message selection state and keeps the DOM in sync.
 *
 * Extracted from the content script for single-responsibility.
 * Handles toggle, clear, and re-syncing visual state after
 * Zalo's virtual list re-renders.
 */
export class SelectionManager {
  private selectedMessages: SelectedMessage[] = [];
  private readonly domParser: ZaloDOMParser;
  private readonly onChange: (messages: SelectedMessage[]) => void;

  constructor(domParser: ZaloDOMParser, onChange: (messages: SelectedMessage[]) => void) {
    this.domParser = domParser;
    this.onChange = onChange;
  }

  /**
   * Toggle selection on a chat item.
   * Returns true if the item was selected, false if deselected.
   */
  toggle(chatItem: HTMLElement): boolean {
    const parsed = this.domParser.parseChatItem(chatItem);
    if (!parsed) return false;

    const msgId = this.domParser.generateMessageId(parsed.isMe, parsed.text);
    chatItem.dataset.zmeId = msgId;

    const existingIndex = this.selectedMessages.findIndex((m) => m.id === msgId);

    if (existingIndex >= 0) {
      // Deselect
      this.selectedMessages.splice(existingIndex, 1);
      chatItem.classList.remove(CSS_CLASSES.SELECTED);
      this.onChange(this.selectedMessages);
      return false;
    } else {
      // Select
      this.selectedMessages.push({
        id: msgId,
        senderType: parsed.isMe ? "me" : "customer",
        text: parsed.text,
        sortIndex: this.domParser.getDomSortIndex(chatItem),
      });
      chatItem.classList.add(CSS_CLASSES.SELECTED);
      this.onChange(this.selectedMessages);
      return true;
    }
  }

  /**
   * Re-apply .zme-selected class to chat items after the DOM re-renders
   * (e.g., when Zalo's React Virtualized scrolls).
   *
   * This uses the text-hash-based IDs which are stable across re-renders.
   * While syncing, it also re-calibrates (updates) the sortIndex of visible
   * messages so that shifting coordinates (due to scrolling up and loading
   * older messages) do not break the final sorted order.
   */
  syncSelectionState(): void {
    const allItems = this.domParser.getAllChatItems();
    const selectedIds = new Set(this.selectedMessages.map((m) => m.id));

    allItems.forEach((item) => {
      const parsed = this.domParser.parseChatItem(item);
      if (!parsed) return;

      const msgId = this.domParser.generateMessageId(parsed.isMe, parsed.text);
      item.dataset.zmeId = msgId;

      if (selectedIds.has(msgId)) {
        item.classList.add(CSS_CLASSES.SELECTED);

        // Re-calibrate the saved sortIndex with the element's updated coordinate
        const matchedMsg = this.selectedMessages.find((m) => m.id === msgId);
        if (matchedMsg) {
          matchedMsg.sortIndex = this.domParser.getDomSortIndex(item);
        }
      } else {
        item.classList.remove(CSS_CLASSES.SELECTED);
      }
    });
  }

  /**
   * Clear all selections and remove visual state from the DOM.
   */
  clear(): void {
    this.selectedMessages = [];
    document.querySelectorAll(`.${CSS_CLASSES.SELECTED}`).forEach((el) => {
      el.classList.remove(CSS_CLASSES.SELECTED);
    });
    this.onChange(this.selectedMessages);
  }

  /**
   * Get a copy of the current selected messages.
   */
  getMessages(): SelectedMessage[] {
    return [...this.selectedMessages];
  }

  /**
   * Whether there are any selected messages.
   */
  hasSelections(): boolean {
    return this.selectedMessages.length > 0;
  }
}
