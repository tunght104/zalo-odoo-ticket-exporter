import { TOAST_ID, CSS_CLASSES, TOAST_DURATION_MS } from "../../shared/constants";

/**
 * Manages toast notification display.
 * Extracted from SidebarManager for single-responsibility.
 */
export class ToastManager {
  private toast: HTMLElement;

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
    this.toast.textContent = message;
    this.toast.classList.add(CSS_CLASSES.TOAST_SHOW);
    setTimeout(() => this.toast.classList.remove(CSS_CLASSES.TOAST_SHOW), TOAST_DURATION_MS);
  }

  destroy(): void {
    document.getElementById(TOAST_ID)?.remove();
  }
}
