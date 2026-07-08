import { SelectedMessage, SidebarOptions, OdooTicketPayload, OdooUpdateTicketPayload, OdooTicketResult } from "../../shared/types";
import {
  SIDEBAR_ID,
  TOGGLE_BTN_ID,
  STYLES_ID,
  CSS_CLASSES,
  COPY_FEEDBACK_DURATION_MS,
  TOGGLE_BTN_TOP_KEY,
} from "../../shared/constants";
import { SIDEBAR_STYLES } from "./styles";
import { ToastManager } from "./ToastManager";
import { MessageFormatter } from "./MessageFormatter";

// ─── Sidebar HTML Template ────────────────────────────────────────────────────

function createSidebarHTML(): string {
  return `
    <div class="zme-sidebar-header">
      <div>
        <div class="zme-sidebar-title">💬 Hội thoại đã chọn</div>
        <div class="zme-sidebar-count" id="zme-count">Chưa có tin nhắn nào</div>
      </div>
      <button class="zme-close-btn" id="zme-close-btn">×</button>
    </div>

    <div class="zme-tabs">
      <button class="zme-tab active" data-tab="create">Tạo mới</button>
      <button class="zme-tab" data-tab="update">Cập nhật</button>
    </div>

    <div class="zme-label-section">

      <!-- Update Only -->
      <div class="zme-label-group zme-only-update" style="display: none;">
        <span class="zme-label-tag">ID Ticket:</span>
        <input class="zme-label-input" id="zme-label-ticket-id" type="number" placeholder="Nhập ID Ticket..." />
      </div>

      <!-- Create Only -->
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Tên của bạn:</span>
        <input class="zme-label-input" id="zme-label-me" type="text" value="me" placeholder="Nhập tên đại diện cho bạn..." />
      </div>
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Tên khách hàng:</span>
        <input class="zme-label-input" id="zme-label-customer" type="text" list="zme-customer-names" value="" placeholder="Nhập tên khách hàng (để trống sẽ lấy tên gốc)..." />
        <datalist id="zme-customer-names"></datalist>
      </div>
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Team xử lý:</span>
        <select class="zme-label-input" id="zme-label-team">
          <option value="1">Hỗ trợ kỹ thuật</option>
          <option value="10">LMS</option>
          <option value="11">E-contract</option>
          <option value="12">TMS</option>
          <option value="6">CRM</option>
          <option value="9">Xspace</option>
          <option value="7">E-learning</option>
        </select>
      </div>
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Tiêu đề:</span>
        <input class="zme-label-input" id="zme-label-title" type="text" placeholder="Nhập tiêu đề..." />
      </div>
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Mô tả:</span>
        <input class="zme-label-input" id="zme-label-desc" type="text" placeholder="Nhập mô tả..." />
      </div>
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Số điện thoại:</span>
        <input class="zme-label-input" id="zme-label-phone" type="text" placeholder="Nhập số điện thoại..." />
      </div>
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Email:</span>
        <input class="zme-label-input" id="zme-label-email" type="email" placeholder="Nhập email khách hàng..." />
      </div>
      <div class="zme-label-group zme-only-create">
        <span class="zme-label-tag">Tag:</span>
        <input class="zme-label-input" id="zme-label-tag" type="text" placeholder="Nhập các tag cách nhau bởi dấu phẩy..." />
      </div>
    </div>

    <div class="zme-preview-section" id="zme-preview">
      ${EMPTY_STATE_HTML}
    </div>

    <div class="zme-sidebar-footer">
      <label class="zme-solved-toggle">
        <input type="checkbox" id="zme-label-solved" checked />
        <span>Đánh dấu là <strong>Đã giải quyết</strong> (Solved)</span>
      </label>
      <button class="zme-btn zme-btn-odoo" id="zme-odoo-btn">🎫 Tạo Ticket</button>
      <button class="zme-btn zme-btn-copy" id="zme-copy-btn">📋 Copy</button>
      <button class="zme-btn zme-btn-clear" id="zme-clear-btn">🗑 Xóa hết</button>
    </div>
  `;
}

// Single source of truth for the empty state markup — also used inside createSidebarHTML()
const EMPTY_STATE_HTML = `
  <div class="zme-empty-state">
    <div class="zme-empty-icon">☑️</div>
    <div class="zme-empty-text">Bật chế độ chọn và tick<br/>vào các tin nhắn bạn muốn</div>
  </div>
`;

// ─── SidebarManager ───────────────────────────────────────────────────────────

/**
 * Manages the sidebar UI for displaying and exporting selected messages.
 *
 * Responsibilities (after refactoring):
 * - Creating and managing sidebar DOM elements
 * - Toggle button for select mode
 * - Rendering message preview (delegates formatting to MessageFormatter)
 * - Copy to clipboard
 * - Toast notifications (delegates to ToastManager)
 */
export class SidebarManager {
  private sidebar: HTMLElement | null = null;
  private toggleBtn: HTMLButtonElement | null = null;
  private previewSection: HTMLElement | null = null;
  private labelMeInput: HTMLInputElement | null = null;
  private labelCustomerInput: HTMLInputElement | null = null;
  private countEl: HTMLElement | null = null;
  private copyBtn: HTMLButtonElement | null = null;

  private isOpen = false;
  private _isSelectModeActive = false;
  private activeTab: "create" | "update" = "create";
  private messages: SelectedMessage[] = [];
  private readonly options: SidebarOptions;
  private readonly toast: ToastManager;
  private readonly formatter: MessageFormatter;
  private odooBtn: HTMLButtonElement | null = null;

  constructor(options: SidebarOptions) {
    this.options = options;
    this.toast = new ToastManager();
    this.formatter = new MessageFormatter();

    this.injectStyles();
    this.createToggleButton();
    this.createSidebar();
  }

  /** Whether select mode is currently active */
  get isSelectModeActive(): boolean {
    return this._isSelectModeActive;
  }

  // ── Style Injection ─────────────────────────────────────────────────────────

  private injectStyles(): void {
    if (document.getElementById(STYLES_ID)) return;
    const style = document.createElement("style");
    style.id = STYLES_ID;
    style.textContent = SIDEBAR_STYLES;
    document.head.appendChild(style);
  }

  // ── Toggle Button ───────────────────────────────────────────────────────────

  private createToggleButton(): void {
    const existing = document.getElementById(TOGGLE_BTN_ID);
    if (existing) existing.remove();

    this.toggleBtn = document.createElement("button");
    this.toggleBtn.id = TOGGLE_BTN_ID;
    this.toggleBtn.innerHTML = `✓ Chọn tin nhắn`;

    // Load saved vertical position, then attach drag
    chrome.storage.local.get([TOGGLE_BTN_TOP_KEY], (stored) => {
      const savedTop = stored[TOGGLE_BTN_TOP_KEY] as number | undefined;
      const defaultTop = Math.round(window.innerHeight * 0.3); // 30vh as fallback
      this.applyBtnTop(savedTop ?? defaultTop);
    });

    this.attachVerticalDrag(this.toggleBtn);
    document.body.appendChild(this.toggleBtn);
  }

  /**
   * Clamp and apply a top value to the toggle button.
   */
  private applyBtnTop(top: number): void {
    if (!this.toggleBtn) return;
    const btnHeight = this.toggleBtn.offsetHeight || 44;
    const clamped = Math.max(8, Math.min(top, window.innerHeight - btnHeight - 8));
    this.toggleBtn.style.top = `${clamped}px`;
  }

  /**
   * Attach vertical-only drag behaviour to the toggle button.
   *
   * Logic:
   *  - mousedown records start position.
   *  - mousemove beyond DRAG_THRESHOLD px activates drag mode.
   *  - mouseup: if drag mode  → save position; otherwise → treat as click.
   */
  private attachVerticalDrag(btn: HTMLButtonElement): void {
    /** Pixels of movement required before we enter drag mode. */
    const DRAG_THRESHOLD = 5;

    let startY = 0;
    let startTop = 0;
    let isDragging = false;

    const onMouseMove = (e: MouseEvent): void => {
      const deltaY = e.clientY - startY;
      if (!isDragging && Math.abs(deltaY) < DRAG_THRESHOLD) return;

      // Enter drag mode on first significant movement
      if (!isDragging) {
        isDragging = true;
        btn.classList.add(CSS_CLASSES.DRAGGING);
      }

      this.applyBtnTop(startTop + deltaY);
    };

    const onMouseUp = (): void => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      if (isDragging) {
        btn.classList.remove(CSS_CLASSES.DRAGGING);
        // Persist final position
        const finalTop = parseInt(btn.style.top, 10);
        chrome.storage.local.set({ [TOGGLE_BTN_TOP_KEY]: finalTop });
      } else {
        // No meaningful movement → treat as a regular click
        this.toggleSelectMode();
      }

      isDragging = false;
    };

    btn.addEventListener("mousedown", (e: MouseEvent) => {
      // Only respond to primary button
      if (e.button !== 0) return;
      e.preventDefault();

      startY = e.clientY;
      startTop = parseInt(btn.style.top, 10) || Math.round(window.innerHeight * 0.3);
      isDragging = false;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // ── Sidebar DOM ─────────────────────────────────────────────────────────────

  private createSidebar(): void {
    const existing = document.getElementById(SIDEBAR_ID);
    if (existing) existing.remove();

    this.sidebar = document.createElement("div");
    this.sidebar.id = SIDEBAR_ID;
    this.sidebar.innerHTML = createSidebarHTML();
    document.body.appendChild(this.sidebar);

    // Cache element references (with null checks instead of ! assertions)
    this.previewSection = this.querySelector<HTMLElement>("#zme-preview");
    this.labelMeInput = this.querySelector<HTMLInputElement>("#zme-label-me");
    this.labelCustomerInput = this.querySelector<HTMLInputElement>("#zme-label-customer");
    this.countEl = this.querySelector<HTMLElement>("#zme-count");
    this.copyBtn = this.querySelector<HTMLButtonElement>("#zme-copy-btn");

    // Event listeners
    this.querySelector<HTMLButtonElement>("#zme-close-btn")
      ?.addEventListener("click", () => this.closeSidebar());

    this.copyBtn?.addEventListener("click", () => this.copyToClipboard());

    this.odooBtn = this.querySelector<HTMLButtonElement>("#zme-odoo-btn");
    this.odooBtn?.addEventListener("click", () => this.submitToOdoo());

    const tabs = this.sidebar?.querySelectorAll<HTMLButtonElement>(".zme-tab");
    tabs?.forEach(tab => {
      tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab") as "create" | "update";
        if (tabName) this.switchTab(tabName);
      });
    });

    this.querySelector<HTMLButtonElement>("#zme-clear-btn")
      ?.addEventListener("click", () => {
        this.options.onClear();
        this.updateMessages([]);
        this.showToast("Đã xóa hết tin nhắn đã chọn");
      });

    // Re-render preview when labels change
    this.labelMeInput?.addEventListener("input", () => this.renderPreview());
    this.labelCustomerInput?.addEventListener("input", () => this.renderPreview());
  }

  /**
   * Safe querySelector within the sidebar. Returns null instead of throwing.
   */
  private querySelector<T extends HTMLElement>(selector: string): T | null {
    return this.sidebar?.querySelector<T>(selector) ?? null;
  }

  // ── Select Mode ─────────────────────────────────────────────────────────────

  toggleSelectMode(): void {
    this._isSelectModeActive = !this._isSelectModeActive;

    if (this._isSelectModeActive) {
      document.body.classList.add(CSS_CLASSES.SELECT_MODE);
      this.toggleBtn?.classList.add(CSS_CLASSES.TOGGLE_ACTIVE);
      if (this.toggleBtn) this.toggleBtn.innerHTML = `✅ Đang chọn...`;
      this.openSidebar();
    } else {
      document.body.classList.remove(CSS_CLASSES.SELECT_MODE);
      this.toggleBtn?.classList.remove(CSS_CLASSES.TOGGLE_ACTIVE);
      if (this.toggleBtn) this.toggleBtn.innerHTML = `✓ Chọn tin nhắn`;
    }
  }

  openSidebar(): void {
    this.isOpen = true;
    this.sidebar?.classList.add(CSS_CLASSES.SIDEBAR_OPEN);
  }

  closeSidebar(): void {
    this.isOpen = false;
    this.sidebar?.classList.remove(CSS_CLASSES.SIDEBAR_OPEN);
  }

  // ── Tabs ────────────────────────────────────────────────────────────────────

  private switchTab(tab: "create" | "update"): void {
    this.activeTab = tab;

    // Update active class on buttons
    const tabs = this.sidebar?.querySelectorAll<HTMLButtonElement>(".zme-tab");
    tabs?.forEach(btn => {
      if (btn.getAttribute("data-tab") === tab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update visibility of sections
    const creates = this.sidebar?.querySelectorAll<HTMLElement>(".zme-only-create");
    creates?.forEach(el => {
      el.style.display = tab === "create" ? "" : "none";
    });

    const updates = this.sidebar?.querySelectorAll<HTMLElement>(".zme-only-update");
    updates?.forEach(el => {
      el.style.display = tab === "update" ? "" : "none";
    });

    // Update button text
    if (this.odooBtn) {
      this.odooBtn.textContent = tab === "create" ? "🎫 Tạo Ticket" : "🎫 Cập nhật Ticket";
    }
  }

  // ── Messages ────────────────────────────────────────────────────────────────

  updateMessages(messages: SelectedMessage[]): void {
    this.messages = [...messages];
    this.renderPreview();
    this.updateCount();

    if (messages.length === 0 && this.labelCustomerInput) {
      this.labelCustomerInput.value = "";
    }

    const senderNames = new Set<string>();
    for (const msg of this.messages) {
      if (msg.senderType === "customer" && msg.senderName) {
        senderNames.add(msg.senderName);
      }
    }

    const datalist = this.querySelector<HTMLDataListElement>("#zme-customer-names");
    if (datalist) {
      datalist.innerHTML = Array.from(senderNames)
        .map(name => `<option value="${name}"></option>`)
        .join("");
    }

    if (messages.length > 0 && !this.isOpen) {
      this.openSidebar();
    }
  }

  private updateCount(): void {
    if (!this.countEl) return;
    const n = this.messages.length;
    this.countEl.textContent =
      n === 0 ? "Chưa có tin nhắn nào" : `${n} tin nhắn đã chọn`;
  }

  private renderPreview(): void {
    if (!this.previewSection) return;

    if (this.messages.length === 0) {
      this.previewSection.innerHTML = EMPTY_STATE_HTML;
      return;
    }

    const meLabel = this.labelMeInput?.value.trim() || "me";
    const customerLabel = this.labelCustomerInput?.value.trim() || "customer";

    this.previewSection.innerHTML = this.formatter.formatAsHtml(
      this.messages,
      meLabel,
      customerLabel
    );
  }

  // ── Odoo Ticket ─────────────────────────────────────────────────────────────

  private async submitToOdoo(): Promise<void> {
    if (this.activeTab === "create") {
      await this.createOdooTicket();
    } else {
      await this.updateOdooTicket();
    }
  }

  private async updateOdooTicket(): Promise<void> {
    if (this.messages.length === 0) {
      this.showToast("⚠️ Chưa có tin nhắn nào để cập nhật ticket!");
      return;
    }

    const ticketIdStr = this.querySelector<HTMLInputElement>("#zme-label-ticket-id")?.value.trim() ?? "";
    const ticketId = parseInt(ticketIdStr, 10);
    if (!ticketId || isNaN(ticketId)) {
      this.showToast("⚠️ Vui lòng nhập ID Ticket hợp lệ!");
      return;
    }

    const customerName = this.querySelector<HTMLInputElement>("#zme-label-customer")?.value.trim() || "customer";
    const meLabel = this.querySelector<HTMLInputElement>("#zme-label-me")?.value.trim() || "me";
    const conversationText = this.formatter.formatAsText(this.messages, meLabel, customerName);
    const markAsSolved = this.querySelector<HTMLInputElement>("#zme-label-solved")?.checked ?? true;

    const payload: OdooUpdateTicketPayload = { ticketId, conversationText, markAsSolved };

    if (this.odooBtn) {
      this.odooBtn.disabled = true;
      this.odooBtn.textContent = "⏳ Đang cập nhật...";
    }

    chrome.runtime.sendMessage(
      { type: "UPDATE_ODOO_TICKET", payload },
      (result: OdooTicketResult) => {
        if (this.odooBtn) {
          this.odooBtn.disabled = false;
          this.odooBtn.textContent = "🎫 Cập nhật Ticket";
        }

        if (!result) {
          this.showToast("❌ Không nhận được phản hồi từ extension. Hãy thử reload trang.");
          return;
        }

        if (!result.success) {
          if (result.error === "NOT_LOGGED_IN") {
            this.showToast("⚠️ Vui lòng đăng nhập Odoo trong popup extension trước!");
          } else {
            this.showToast(`❌ Lỗi: ${result.error ?? "Không xác định"}`);
          }
          return;
        }

        this.showToast(`✅ Đã cập nhật ticket #${result.ticketId} thành công!`);
      }
    );
  }

  private async createOdooTicket(): Promise<void> {
    if (this.messages.length === 0) {
      this.showToast("⚠️ Chưa có tin nhắn nào để tạo ticket!");
      return;
    }

    const title = this.querySelector<HTMLInputElement>("#zme-label-title")?.value.trim() ?? "";
    if (!title) {
      this.showToast("⚠️ Vui lòng nhập Tiêu đề trước khi tạo ticket!");
      return;
    }

    const phone = this.querySelector<HTMLInputElement>("#zme-label-phone")?.value.trim() ?? "";
    // Basic phone validation: must be digits/+/spaces only, at least 7 chars if provided
    if (phone && !/^[\d\s+()\-]{7,}$/.test(phone)) {
      this.showToast("⚠️ Số điện thoại không hợp lệ!");
      return;
    }

    const description = this.querySelector<HTMLInputElement>("#zme-label-desc")?.value.trim() ?? "";
    const customerName = this.querySelector<HTMLInputElement>("#zme-label-customer")?.value.trim() || "customer";
    const tagString = this.querySelector<HTMLInputElement>("#zme-label-tag")?.value.trim() || "Zalo";
    const tagNames = tagString.split(",").map(t => t.trim()).filter(t => t.length > 0);
    const meLabel = this.querySelector<HTMLInputElement>("#zme-label-me")?.value.trim() || "me";
    const conversationText = this.formatter.formatAsText(this.messages, meLabel, customerName);
    const markAsSolved = this.querySelector<HTMLInputElement>("#zme-label-solved")?.checked ?? true;

    // We pass an empty string for email as it is not collected in the sidebar form yet, 
    // but the payload expects it.
    const email = this.querySelector<HTMLInputElement>("#zme-label-email")?.value.trim() ?? "";

    const teamIdStr = this.querySelector<HTMLSelectElement>("#zme-label-team")?.value || "1";
    const teamId = parseInt(teamIdStr, 10);

    const payload: OdooTicketPayload = { title, description, customerName, phone, email, tagNames, conversationText, markAsSolved, teamId };

    // Set loading state
    if (this.odooBtn) {
      this.odooBtn.disabled = true;
      this.odooBtn.textContent = "⏳ Đang tạo...";
    }

    chrome.runtime.sendMessage(
      { type: "CREATE_ODOO_TICKET", payload },
      (result: OdooTicketResult) => {
        // Reset button
        if (this.odooBtn) {
          this.odooBtn.disabled = false;
          this.odooBtn.textContent = "🎫 Tạo Ticket";
        }

        if (!result) {
          this.showToast("❌ Không nhận được phản hồi từ extension. Hãy thử reload trang.");
          return;
        }

        if (!result.success) {
          if (result.error === "NOT_LOGGED_IN") {
            this.showToast("⚠️ Vui lòng đăng nhập Odoo trong popup extension trước!");
          } else {
            this.showToast(`❌ Lỗi: ${result.error ?? "Không xác định"}`);
          }
          return;
        }

        this.showToast(`✅ Đã tạo ticket #${result.ticketId} thành công!`);
      }
    );
  }

  // ── Clipboard ───────────────────────────────────────────────────────────────

  private async copyToClipboard(): Promise<void> {
    if (this.messages.length === 0) {
      this.showToast("Chưa có tin nhắn nào để copy!");
      return;
    }

    const meLabel = this.labelMeInput?.value.trim() || "me";
    const customerLabel = this.labelCustomerInput?.value.trim() || "customer";
    const text = this.formatter.formatAsText(this.messages, meLabel, customerLabel);

    try {
      await navigator.clipboard.writeText(text);
      this.showCopySuccess();
    } catch {
      // Fallback: textarea trick for environments where Clipboard API is blocked
      // Note: document.execCommand("copy") is deprecated but kept as a last resort.
      console.warn("[ZME] Clipboard API unavailable — falling back to execCommand copy.");
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      this.showCopySuccess();
    }
  }

  private showCopySuccess(): void {
    if (this.copyBtn) {
      this.copyBtn.textContent = "✅ Đã copy!";
      this.copyBtn.classList.add(CSS_CLASSES.COPIED);
      setTimeout(() => {
        if (this.copyBtn) {
          this.copyBtn.textContent = "📋 Copy";
          this.copyBtn.classList.remove(CSS_CLASSES.COPIED);
        }
      }, COPY_FEEDBACK_DURATION_MS);
    }
    this.showToast("Đã copy hội thoại vào Clipboard!");
  }

  // ── Toast ───────────────────────────────────────────────────────────────────

  showToast(msg: string): void {
    this.toast.show(msg);
  }

  // ── Cleanup ─────────────────────────────────────────────────────────────────

  destroy(): void {
    document.getElementById(SIDEBAR_ID)?.remove();
    document.getElementById(TOGGLE_BTN_ID)?.remove();
    document.getElementById(STYLES_ID)?.remove();
    document.body.classList.remove(CSS_CLASSES.SELECT_MODE);
    this.toast.destroy();
  }
}
