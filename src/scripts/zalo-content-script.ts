import { SidebarManager, SelectedMessage } from "../UI/SidebarManager";

// ─── State ────────────────────────────────────────────────────────────────────
let selectedMessages: SelectedMessage[] = [];
let sidebar: SidebarManager | null = null;
let currentConversationKey = "";
let observerRef: MutationObserver | null = null;

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Extract clean message text from .chat-content.
 * Cuts off the timestamp and everything after it (reactions).
 */
function extractCleanText(chatContent: HTMLElement): string {
  let text = chatContent.innerText?.trim() ?? "";
  if (!text) return "";

  // Zalo's timestamp is usually on a new line like "\n16:09" or "\n16:"
  // This regex finds the newline + timestamp, and removes it along with EVERYTHING after it.
  text = text.replace(/\n\d{1,2}:\d{2}[\s\S]*$/, "");
  
  // Fallback for cut-off timestamps like "\n16:"
  text = text.replace(/\n\d{1,2}:[\s\S]*$/, "");

  return text.trim();
}

function getCurrentConversationKey(): string {
  return window.location.href;
}

// ─── Selection Logic (No DOM Injection) ───────────────────────────────────────

/**
 * Sync the .zme-selected class on all visible chat items based on the current
 * selectedMessages state. This ensures that when Zalo's React Virtualized
 * re-renders the list, selected items keep their visual state.
 */
function syncSelectionState() {
  const allItems = document.querySelectorAll<HTMLElement>(".block-date .chat-item");
  const selectedIds = new Set(selectedMessages.map(m => m.id));

  allItems.forEach(item => {
    // Generate a unique ID for this item based on its text and timestamp
    // Since Zalo dynamically removes/adds elements, we identify them by text
    const chatContent = item.querySelector<HTMLElement>(".chat-content");
    if (!chatContent) return;
    
    const text = extractCleanText(chatContent);
    if (!text) return;

    // Use a hash-like ID for the message
    const isMe = item.classList.contains("me");
    const msgId = `msg-${isMe ? 'me' : 'cus'}-${text.substring(0, 30).replace(/\s+/g, '')}`;

    // Store the ID on the element for easy retrieval
    item.dataset.zmeId = msgId;

    if (selectedIds.has(msgId)) {
      item.classList.add("zme-selected");
    } else {
      item.classList.remove("zme-selected");
    }
  });
}

/**
 * Handle clicks on the document body to intercept clicks on chat items.
 * We use Event Delegation to avoid attaching listeners to React nodes.
 */
function handleGlobalClick(e: MouseEvent) {
  // Only process if select mode is active
  if (!document.body.classList.contains("zme-select-mode")) return;

  const target = e.target as HTMLElement;
  
  // Find the closest chat item row
  const chatItem = target.closest<HTMLElement>(".chat-item");
  if (!chatItem) return;

  // Don't intercept clicks inside our own sidebar
  if (target.closest("#zme-sidebar")) return;

  // Prevent default Zalo actions (like opening images) when in select mode
  e.preventDefault();
  e.stopPropagation();

  // Extract info
  const chatContent = chatItem.querySelector<HTMLElement>(".chat-content");
  if (!chatContent) return;

  const text = extractCleanText(chatContent);
  if (!text) return;

  const isMe = chatItem.classList.contains("me");
  const senderType: "me" | "customer" = isMe ? "me" : "customer";
  
  // Generate ID matching the one in syncSelectionState
  const msgId = chatItem.dataset.zmeId || `msg-${isMe ? 'me' : 'cus'}-${text.substring(0, 30).replace(/\s+/g, '')}`;

  // Toggle selection
  const existingIndex = selectedMessages.findIndex(m => m.id === msgId);
  
  if (existingIndex >= 0) {
    // Remove
    selectedMessages.splice(existingIndex, 1);
    chatItem.classList.remove("zme-selected");
  } else {
    // Add
    selectedMessages.push({
      id: msgId,
      senderType,
      text,
      timestamp: Date.now()
    });
    chatItem.classList.add("zme-selected");
  }

  // Update sidebar UI
  sidebar?.updateMessages(selectedMessages);
}

// ─── Conversation Change Detection ───────────────────────────────────────────

function clearAll() {
  selectedMessages = [];
  sidebar?.updateMessages([]);
  
  // Remove selection class from all items
  document.querySelectorAll(".zme-selected").forEach(el => {
    el.classList.remove("zme-selected");
  });
}

function onConversationChange(newKey: string) {
  console.log("[ZME] Conversation changed:", newKey);
  clearAll();
  sidebar?.showToast("Đã chuyển cuộc trò chuyện — danh sách đã xóa");
}

// ─── Observers ────────────────────────────────────────────────────────────────

/**
 * Watch for DOM mutations to re-apply the .zme-selected class if React 
 * re-renders the virtualized list. We debounce this to avoid performance issues.
 */
function watchMessageArea() {
  let timeout: number | null = null;
  
  const mutationObserver = new MutationObserver(() => {
    if (timeout) cancelAnimationFrame(timeout);
    timeout = requestAnimationFrame(() => {
      // Only sync if we actually have selections
      if (selectedMessages.length > 0) {
        syncSelectionState();
      }
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });
}

function watchNavigation() {
  observerRef?.disconnect();

  const checkUrlChange = () => {
    const newKey = getCurrentConversationKey();
    if (newKey !== currentConversationKey) {
      currentConversationKey = newKey;
      onConversationChange(newKey);
    }
  };

  window.addEventListener("popstate", checkUrlChange);

  observerRef = new MutationObserver(checkUrlChange);
  observerRef.observe(document.body, {
    childList: true,
    subtree: false,
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

function init() {
  console.log("[ZME] Zalo Message Exporter v1.1 initializing (Event Delegation Mode)...");

  // Setup Global Click Listener for selection
  document.body.addEventListener("click", handleGlobalClick, { capture: true });

  sidebar = new SidebarManager({
    onClear: clearAll,
  });

  currentConversationKey = getCurrentConversationKey();

  setTimeout(() => {
    watchMessageArea();
    watchNavigation();
    console.log("[ZME] Ready. Zero-DOM-Injection mode active.");
  }, 2000);
}

setTimeout(init, 1500);
