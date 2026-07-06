import { TOAST_ID, CSS_CLASSES, TOAST_DURATION_MS } from "../../shared/constants";

/**
 * Manages toast notification display.
 * Extracted from SidebarManager for single-responsibility.
 */
export class ToastManager {
  private toast: HTMLElement;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.toast = this.createToast();
  }

  private createToast(): HTMLElement {
    const existing = document.getElementById(TOAST_ID);
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    document.body.appendChild(toast);
    return toast;
  }

  show(message: string): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.toast.textContent = message;
    this.toast.classList.add(CSS_CLASSES.TOAST_SHOW);
    this.timeoutId = setTimeout(() => {
      this.toast.classList.remove(CSS_CLASSES.TOAST_SHOW);
      this.timeoutId = null;
    }, TOAST_DURATION_MS);
  }

  destroy(): void {
    document.getElementById(TOAST_ID)?.remove();
  }
}
