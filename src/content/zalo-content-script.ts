import { SelectedMessage } from "../shared/types";
import { CSS_CLASSES, INIT_DELAY_MS, OBSERVER_SETUP_DELAY_MS } from "../shared/constants";
import { ZaloDOMParser } from "./dom/ZaloDOMParser";
import { SelectionManager } from "./selection/SelectionManager";
import { SidebarManager } from "./ui/SidebarManager";

// ─── Module Instances ─────────────────────────────────────────────────────────

let domParser: ZaloDOMParser;
let selectionManager: SelectionManager;
let sidebar: SidebarManager;
let currentConversationKey = "";

let messageAreaObserver: MutationObserver | null = null;

// ─── Click Handler (Event Delegation) ─────────────────────────────────────────

/**
 * Global click handler using event delegation to intercept clicks on chat items.
 * Avoids attaching listeners to React-managed nodes that may be re-rendered.
 */
function handleGlobalClick(e: MouseEvent): void {
  // Only process if select mode is active
  if (!document.body.classList.contains(CSS_CLASSES.SELECT_MODE)) return;

  const target = e.target as HTMLElement;

  // Find the closest chat item row
  const chatItem = target.closest<HTMLElement>(".chat-item");
  if (!chatItem) return;

  // Don't intercept clicks inside our own sidebar
  if (target.closest("#zme-sidebar")) return;

  // Prevent default Zalo actions (like opening images) when in select mode
  e.preventDefault();
  e.stopPropagation();

  // Toggle selection through the SelectionManager
  selectionManager.toggle(chatItem);

  // Update sidebar UI
  sidebar.updateMessages(selectionManager.getMessages());
}

// ─── Conversation Change Detection ────────────────────────────────────────────

function clearAll(): void {
  selectionManager.clear();
  sidebar.updateMessages([]);
}

function onConversationChange(newKey: string): void {
  console.log("[ZME] Conversation changed:", newKey);
  clearAll();
  sidebar.showToast("Đã chuyển cuộc trò chuyện — danh sách đã xóa");
}

// ─── Observers ────────────────────────────────────────────────────────────────

/**
 * Watch for DOM mutations to re-apply selection visual state when
 * Zalo's React Virtualized re-renders the message list.
 */
function watchMessageArea(): void {
  // Disconnect previous observer if any (prevents duplicates)
  messageAreaObserver?.disconnect();

  let rafId: number | null = null;

  messageAreaObserver = new MutationObserver(() => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      // 1. Check for conversation change
      const newKey = domParser.getCurrentConversationKey();
      if (newKey !== currentConversationKey) {
        currentConversationKey = newKey;
        onConversationChange(newKey);
      }

      // 2. Sync selection visual state
      if (selectionManager.hasSelections()) {
        selectionManager.syncSelectionState();
      }
    });
  });

  messageAreaObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
}


// ─── Bootstrap ────────────────────────────────────────────────────────────────

function onSelectionChange(_messages: SelectedMessage[]): void {
  // Selection changes are already handled by the click handler calling
  // sidebar.updateMessages(). This callback can be used for additional
  // side effects in the future (e.g., persisting to chrome.storage).
}

function init(): void {
  console.log("[ZME] Zalo Message Exporter v2.0 initializing...");

  domParser = new ZaloDOMParser();
  selectionManager = new SelectionManager(domParser, onSelectionChange);

  sidebar = new SidebarManager({
    onClear: clearAll,
  });

  // Global click listener for selection (capture phase for priority)
  document.body.addEventListener("click", handleGlobalClick, { capture: true });

  currentConversationKey = domParser.getCurrentConversationKey();

  // Delay observer setup to let Zalo's chat area fully render
  setTimeout(() => {
    watchMessageArea();
    console.log("[ZME] Ready. Modular architecture active.");
  }, OBSERVER_SETUP_DELAY_MS);
}

setTimeout(init, INIT_DELAY_MS);
