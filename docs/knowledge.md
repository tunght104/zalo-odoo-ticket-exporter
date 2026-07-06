# Zalo Customer Support Extension - Knowledge Base

This document provides a comprehensive overview of the "Zalo Customer Support" (or Zalo Message Exporter) project. It is designed to help AI Agents and developers quickly get up to speed with the project's purpose, architecture, and technology stack.

---

## 1. Main Project Goal

The project is a **Chrome Extension** that acts as a Content Script injected directly into `chat.zalo.me`. 
Key objectives:
- **Message Selection:** Allows customer support agents to click and select specific messages from a Zalo chat conversation.
- **Formatting and Export:** Collects selected messages, sorts them chronologically by selection click time, allows customization of sender labels (e.g., "Me", "Customer"), and exports them cleanly to the clipboard.
- **Boost Productivity:** Replaces manual copy-pasting (which is messy, capturing timestamp noise, reaction logs, and duplicate sender labels) with a clean, structured workflow.

---

## 2. File Structures (Module breakdown)

The project applies the **Single Responsibility Principle (SRP)** by modularizing features into dedicated directories under `src/content/`:

### A. Core & Entry Point
- **`src/content/zalo-content-script.ts`:** The entry point of the Content Script. It bootstraps the modules, attaches global click listeners using Event Delegation, and initializes `MutationObserver` to watch for DOM updates (e.g., when virtual lists render new messages or when switching active chats).

### B. DOM Parser Layer
- **`src/content/dom/ZaloDOMParser.ts`:** Handles all direct interactions with Zalo's HTML structure. Class name queries and structural details are isolated here.
  - Parses chat content (clean text extraction, sender identification).
  - Generates unique message IDs based on a 32-bit text hash.
  - Identifies the active conversation by locating the `.conv-item.selected` element and fetching its `anim-data-id` attribute.

### C. State & Selection Layer
- **`src/content/selection/SelectionManager.ts`:** Manages the active state of selected messages (`selectedMessages`).
  - Tracks the timestamp of selection (`selectedAt: Date.now()`).
  - Appends visual selection indicators (`.zme-selected` class).
  - Synchronizes selection visual states via `syncSelectionState()` whenever Zalo's virtual scroll destroys and re-creates DOM nodes.

### D. UI Layer (Vanilla JS)
- **`src/content/ui/SidebarManager.ts`:** Injects and manages the sidebar panel on the right side of the screen, controlling input forms (labels, titles, tags) and action buttons (Copy, Clear).
- **`src/content/ui/MessageFormatter.ts`:** Handles the presentation layer by sorting messages by click time (`selectedAt`) and transforming the array into formatted HTML (for sidebar preview) or clean plain text (for clipboard copy).
- **`src/content/ui/ToastManager.ts`:** Triggers transient floating pop-up notifications (e.g., "Copied to clipboard!").
- **`src/content/ui/styles.ts`:** Holds the CSS stylesheet string injected into Zalo's DOM to style the extension sidebar.

### E. Shared Module
- **`src/shared/constants.ts`:** Holds selectors, CSS classes (both for the extension and target Zalo elements), and timing configurations.
- **`src/shared/types.ts`:** TypeScript interfaces and type definitions (e.g., `SelectedMessage`, `SidebarOptions`).

### F. Popup (Browser Action UI)
- **`src/popup/main.tsx` & `src/popup/...`:** The popup UI shown when clicking the extension icon in the browser toolbar (built with ReactJS).

---

## 3. Technologies Used in the Project

1.  **Main Language:** **TypeScript** (Strict type checking, OOP structure).
2.  **Popup UI:** **ReactJS (TSX)**.
3.  **Content Script UI:** **Vanilla JavaScript/DOM Manipulation**. 
    - *Note:* The content script avoids using React to prevent package size bloat and runtime conflicts with Zalo's own virtual React DOM. Components (Sidebar, Toast) are lightweight elements created via `document.createElement`.
4.  **Bundler:** **Vite**. Configured to build separate bundles for the Popup, Background, and Content Scripts, wrapping Rollup underneath.
5.  **Package Manager:** **npm/pnpm**.
6.  **Key Patterns:**
    - `MutationObserver` for watching Zalo's Virtual Scroll re-renders and active chat state.
    - `Event Delegation` at the document body to intercept message selections efficiently.
    - Decoupled MVC/Service-based module architecture.
