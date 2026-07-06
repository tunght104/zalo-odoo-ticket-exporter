# Zalo Customer Support Extension - Knowledge Base (v2)

This document provides a comprehensive overview of the "Zalo Customer Support" (or Zalo Message Exporter) project, updated for **v2** which includes the Odoo Helpdesk integration. It is designed to help AI Agents and developers quickly get up to speed with the project's purpose, architecture, and technology stack.

---

## 1. Main Project Goal

The project is a **Chrome Extension** that acts as a Content Script injected directly into `chat.zalo.me`. 
Key objectives:
- **Message Selection:** Allows customer support agents to click and select specific messages from a Zalo chat conversation.
- **Formatting and Export:** Collects selected messages, sorts them chronologically by selection click time, allows customization of sender labels (e.g., "Me", "Customer"), and exports them cleanly to the clipboard.
- **Odoo Helpdesk Integration:** Allows agents to create Helpdesk tickets directly from the extension sidebar. It automatically creates customers, tags, the ticket itself, and logs the selected conversation as a comment (email) on the ticket before marking it as "Solved".
- **Boost Productivity:** Replaces manual copy-pasting and manual ticket creation workflows with a streamlined, 1-click process.

---

## 2. File Structures (Module breakdown)

The project applies the **Single Responsibility Principle (SRP)** by modularizing features into dedicated directories:

### A. Core & Entry Point
- **`src/content/zalo-content-script.ts`:** The entry point of the Content Script. It bootstraps the modules, attaches global click listeners using Event Delegation, and initializes `MutationObserver` to watch for DOM updates.

### B. DOM Parser Layer (`src/content/dom/`)
- **`ZaloDOMParser.ts`:** Handles all direct interactions with Zalo's HTML structure. Parses chat content, generates unique message IDs, and identifies the active conversation.

### C. State & Selection Layer (`src/content/selection/`)
- **`SelectionManager.ts`:** Manages the active state of selected messages (`selectedMessages`), tracks selection timestamps, and synchronizes visual states.

### D. UI Layer - Vanilla JS (`src/content/ui/`)
- **`SidebarManager.ts`:** Injects and manages the sidebar panel on the right side of the screen. Controls input forms (labels, titles, tags, etc.) and action buttons (Copy, Create Odoo Ticket, Clear).
- **`MessageFormatter.ts`:** Formats messages into HTML for preview or plain text for export/Odoo.
- **`ToastManager.ts`:** Triggers transient floating pop-up notifications.
- **`styles.ts`:** CSS stylesheet string injected into Zalo's DOM to style the extension sidebar.

### E. Background Service Worker (`src/background/`)
- **`service-worker.ts`:** A background script that acts as a proxy to bypass CORS restrictions. It receives `CREATE_ODOO_TICKET` messages from the Content Script and executes a sequence of Odoo JSON-RPC API calls:
  1. Authenticates the user.
  2. Finds or creates the customer (`res.partner`).
  3. Finds or creates the tag (`helpdesk.tag`).
  4. Creates the ticket (`helpdesk.ticket`).
  5. Sends the conversation as a comment (`mail.compose.message`).
  6. Changes the ticket stage to "Solved".

### F. Shared Module (`src/shared/`)
- **`constants.ts`:** Selectors, CSS classes, and timing configurations.
- **`types.ts`:** TypeScript interfaces, including Odoo payload and result types.

### G. Popup - ReactJS (`src/popup/`)
- **`Popup.tsx` & `Popup.css`:** The browser action UI. It manages the Odoo authentication state. Users enter their Odoo Email and API Key here, which is saved to `chrome.storage.local` for the Service Worker to use during API calls.

---

## 3. Technologies Used in the Project

1.  **Main Language:** **TypeScript** (Strict type checking, OOP structure).
2.  **Popup UI:** **ReactJS (TSX)** for stateful forms and auth management.
3.  **Content Script UI:** **Vanilla JavaScript/DOM Manipulation**. 
    - *Note:* The content script avoids using React to prevent package size bloat and runtime conflicts with Zalo's own virtual React DOM.
4.  **Background Processing:** **Service Worker** for executing cross-origin API requests (Odoo JSON-RPC).
5.  **Bundler:** **Vite**. Configured with multiple entry points for the Popup, Background Service Worker, and Content Script.
6.  **Package Manager:** **npm/pnpm**.
7.  **Key Patterns:**
    - `MutationObserver` for watching Zalo's Virtual Scroll re-renders.
    - `Event Delegation` at the document body to intercept message selections efficiently.
    - `Message Passing` (`chrome.runtime.sendMessage`) between Content Script and Service Worker.

---

## 4. Odoo Integration Architecture

- **Credentials Management:** Odoo URL, DB, Team ID, and Stage ID are provided at build-time via `.env` (`VITE_ODOO_*`). User-specific credentials (Email and API Key) are entered at runtime via the Popup and stored in `chrome.storage.local`.
- **CORS Bypass:** The Service Worker handles all API calls because the Content Script runs in `chat.zalo.me` and cannot fetch from Odoo directly due to CORS.
- **Sequential API Execution:** The Service Worker orchestrates the creation flow sequentially (e.g., the ticket must be created successfully before the conversation is posted as a comment or the stage is updated).
