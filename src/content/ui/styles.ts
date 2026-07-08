/**
 * Sidebar CSS styles as an exported string for injection into the page.
 *
 * Separated from SidebarManager for maintainability.
 * In a content script context, CSS must be injected as a <style> tag
 * rather than imported normally.
 */
export const SIDEBAR_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ── Toggle Button ── */
#zme-toggle-btn {
  position: fixed;
  top: 200px; /* default; overridden by JS drag/storage */
  right: 24px;
  z-index: 999999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 24px;
  cursor: grab;
  box-shadow: 0 4px 20px rgba(99,102,241,0.5);
  transition: box-shadow 0.2s ease, background 0.2s ease;
  letter-spacing: 0.2px;
  user-select: none;
  touch-action: none;
}
#zme-toggle-btn:hover {
  box-shadow: 0 6px 24px rgba(99,102,241,0.6);
}
#zme-toggle-btn.zme-dragging {
  cursor: grabbing;
  opacity: 0.85;
  box-shadow: 0 8px 28px rgba(99,102,241,0.55);
}
#zme-toggle-btn.zme-active {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 4px 20px rgba(16,185,129,0.5);
}

/* ── Sidebar ── */
#zme-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 340px;
  height: 100vh;
  z-index: 999998;
  display: flex;
  flex-direction: column;
  background: rgba(15, 15, 25, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(99,102,241,0.25);
  box-shadow: none;
  transition: right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-family: 'Inter', sans-serif;
}
#zme-sidebar.zme-open {
  right: 0;
}

/* ── Sidebar Header ── */
.zme-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.zme-sidebar-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}
.zme-sidebar-count {
  font-size: 11px;
  color: #8b8ba7;
  margin-top: 2px;
}
.zme-close-btn {
  background: none;
  border: none;
  color: #8b8ba7;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.zme-close-btn:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
}

/* ── Label Settings ── */
.zme-label-section {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 40vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}
.zme-label-section::-webkit-scrollbar { width: 4px; }
.zme-label-section::-webkit-scrollbar-track { background: transparent; }
.zme-label-section::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}
.zme-label-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}
.zme-label-tag {
  font-size: 10px;
  font-weight: 600;
  color: #8b8ba7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.zme-label-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #e8e8f0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}
.zme-label-input:focus {
  border-color: rgba(99,102,241,0.5);
}
#zme-label-me { border-left: 2px solid #6366f1; }
#zme-label-customer { border-left: 2px solid #10b981; }

.zme-solved-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(99,102,241,0.25);
  background: rgba(99,102,241,0.07);
  cursor: pointer;
  user-select: none;
  transition: background 0.15s, border-color 0.15s;
}
.zme-solved-toggle:hover {
  background: rgba(99,102,241,0.13);
  border-color: rgba(99,102,241,0.45);
}
.zme-solved-toggle input[type="checkbox"] {
  cursor: pointer;
  accent-color: #6366f1;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.zme-solved-toggle span {
  font-size: 12px;
  color: #c8c8e0;
  line-height: 1.3;
}
.zme-solved-toggle span strong {
  color: #a5b4fc;
  font-weight: 600;
}

/* ── Message Preview ── */
.zme-preview-section {
  flex: 1;
  overflow-y: auto;
  padding: 14px 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}
.zme-preview-section::-webkit-scrollbar { width: 4px; }
.zme-preview-section::-webkit-scrollbar-track { background: transparent; }
.zme-preview-section::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}

.zme-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  color: #4a4a6a;
}
.zme-empty-icon {
  font-size: 36px;
  opacity: 0.5;
}
.zme-empty-text {
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
}

.zme-preview-line {
  padding: 4px 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: #c8c8e0;
  word-break: break-word;
}
.zme-preview-line .zme-sender-me {
  color: #818cf8;
  font-weight: 600;
}
.zme-preview-line .zme-sender-customer {
  color: #34d399;
  font-weight: 600;
}

/* ── Footer Actions ── */
.zme-sidebar-footer {
  padding: 14px 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.zme-btn {
  flex: 1;
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.2px;
}
.zme-btn-copy {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 3px 10px rgba(99,102,241,0.35);
}
.zme-btn-copy:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.zme-btn-copy.zme-copied {
  background: linear-gradient(135deg, #10b981, #059669);
}
.zme-btn-clear {
  background: rgba(255,255,255,0.07);
  color: #8b8ba7;
  border: 1px solid rgba(255,255,255,0.1);
}
.zme-btn-clear:hover {
  background: rgba(239,68,68,0.15);
  color: #f87171;
  border-color: rgba(239,68,68,0.3);
}
.zme-btn-odoo {
  background: linear-gradient(135deg, #6d28d9, #7c3aed);
  color: #fff;
  box-shadow: 0 3px 10px rgba(109,40,217,0.35);
  flex: 1 1 100%;
}
.zme-btn-odoo:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}
.zme-btn-odoo:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

/* ── Hover & Selection Effects (CSS-only, no DOM injection) ── */
body.zme-select-mode .chat-item {
  cursor: pointer !important;
  transition: background-color 0.2s ease;
}
body.zme-select-mode .chat-item:hover {
  background-color: rgba(99, 102, 241, 0.1) !important;
  border-radius: 8px;
}

.chat-item.zme-selected {
  background-color: rgba(99, 102, 241, 0.2) !important;
  border-radius: 8px;
}

.chat-item.zme-selected::after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6l3 3 5-5' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 14px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
  z-index: 100;
  pointer-events: none;
}

/* "me" messages: checkmark on the left */
.chat-item.me.zme-selected::after {
  left: -10px;
}
/* "customer" messages: checkmark on the right */
.chat-item:not(.me).zme-selected::after {
  right: -10px;
}

/* ── Toast ── */
#zme-toast {
  position: fixed;
  bottom: 150px;
  right: 24px;
  z-index: 9999999;
  padding: 10px 18px;
  background: rgba(16,185,129,0.9);
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}
#zme-toast.zme-show {
  transform: translateY(0);
  opacity: 1;
}
`;
