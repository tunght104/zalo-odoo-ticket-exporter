var v=Object.defineProperty;var y=(s,e,t)=>e in s?v(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var i=(s,e,t)=>y(s,typeof e!="symbol"?e+"":e,t);const h="zme-sidebar",u="zme-toggle-btn",w=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ── Toggle Button ── */
#zme-toggle-btn {
  position: fixed;
  bottom: 80px;
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
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(99,102,241,0.5);
  transition: all 0.2s ease;
  letter-spacing: 0.2px;
  user-select: none;
}
#zme-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(99,102,241,0.6);
}
#zme-toggle-btn:active {
  transform: translateY(0);
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

/* ── Hover & Selection Effects (No DOM injection) ── */
/* When select mode is active, make chat items clickable */
body.zme-select-mode .chat-item {
  cursor: pointer !important;
  transition: background-color 0.2s ease;
}
body.zme-select-mode .chat-item:hover {
  background-color: rgba(99, 102, 241, 0.1) !important;
  border-radius: 8px;
}

/* Selected state */
.chat-item.zme-selected {
  background-color: rgba(99, 102, 241, 0.2) !important;
  border-radius: 8px;
}

/* Pseudo-element for the checkmark */
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

/* "me" messages are right-aligned → checkmark on the left */
.chat-item.me.zme-selected::after {
  left: -10px;
}
/* "customer" messages are left-aligned → checkmark on the right */
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
`;class k{constructor(e){i(this,"sidebar");i(this,"toggleBtn");i(this,"previewSection");i(this,"labelMeInput");i(this,"labelCustomerInput");i(this,"countEl");i(this,"copyBtn");i(this,"toast");i(this,"isOpen",!1);i(this,"messages",[]);i(this,"options");i(this,"isSelectModeActive",!1);this.options=e,this.injectStyles(),this.createToggleButton(),this.createSidebar(),this.createToast()}injectStyles(){if(document.getElementById("zme-styles"))return;const e=document.createElement("style");e.id="zme-styles",e.textContent=w,document.head.appendChild(e)}createToast(){this.toast=document.createElement("div"),this.toast.id="zme-toast",document.body.appendChild(this.toast)}showToast(e){this.toast.textContent=e,this.toast.classList.add("zme-show"),setTimeout(()=>this.toast.classList.remove("zme-show"),2500)}createToggleButton(){const e=document.getElementById(u);e&&e.remove(),this.toggleBtn=document.createElement("button"),this.toggleBtn.id=u,this.toggleBtn.innerHTML="✓ Chọn tin nhắn",this.toggleBtn.addEventListener("click",()=>this.toggleSelectMode()),document.body.appendChild(this.toggleBtn)}createSidebar(){const e=document.getElementById(h);e&&e.remove(),this.sidebar=document.createElement("div"),this.sidebar.id=h,this.sidebar.innerHTML=`
      <div class="zme-sidebar-header">
        <div>
          <div class="zme-sidebar-title">💬 Hội thoại đã chọn</div>
          <div class="zme-sidebar-count" id="zme-count">Chưa có tin nhắn nào</div>
        </div>
        <button class="zme-close-btn" id="zme-close-btn">×</button>
      </div>

      <div class="zme-label-section">
        <div class="zme-label-group">
          <span class="zme-label-tag">Tên của bạn:</span>
          <input class="zme-label-input" id="zme-label-me" type="text" value="me" placeholder="Nhập tên đại diện cho bạn..." />
        </div>
        <div class="zme-label-group">
          <span class="zme-label-tag">Tên khách hàng:</span>
          <input class="zme-label-input" id="zme-label-customer" type="text" value="customer" placeholder="Nhập tên khách hàng..." />
        </div>
        <div class="zme-label-group">
          <span class="zme-label-tag">Tiêu đề:</span>
          <input class="zme-label-input" id="zme-label-title" type="text" placeholder="Nhập tiêu đề..." />
        </div>
        <div class="zme-label-group">
          <span class="zme-label-tag">Mô tả:</span>
          <input class="zme-label-input" id="zme-label-desc" type="text" placeholder="Nhập mô tả..." />
        </div>
        <div class="zme-label-group">
          <span class="zme-label-tag">Số điện thoại:</span>
          <input class="zme-label-input" id="zme-label-phone" type="text" placeholder="Nhập số điện thoại..." />
        </div>
        <div class="zme-label-group">
          <span class="zme-label-tag">Tag:</span>
          <input class="zme-label-input" id="zme-label-tag" type="text" placeholder="Nhập tag..." />
        </div>
      </div>

      <div class="zme-preview-section" id="zme-preview">
        <div class="zme-empty-state">
          <div class="zme-empty-icon">☑️</div>
          <div class="zme-empty-text">Bật chế độ chọn và tick<br/>vào các tin nhắn bạn muốn</div>
        </div>
      </div>

      <div class="zme-sidebar-footer">
        <button class="zme-btn zme-btn-copy" id="zme-copy-btn">📋 Copy</button>
        <button class="zme-btn zme-btn-clear" id="zme-clear-btn">🗑 Xóa hết</button>
      </div>
    `,document.body.appendChild(this.sidebar),this.previewSection=this.sidebar.querySelector("#zme-preview"),this.labelMeInput=this.sidebar.querySelector("#zme-label-me"),this.labelCustomerInput=this.sidebar.querySelector("#zme-label-customer"),this.countEl=this.sidebar.querySelector("#zme-count"),this.copyBtn=this.sidebar.querySelector("#zme-copy-btn"),this.sidebar.querySelector("#zme-close-btn").addEventListener("click",()=>{this.closeSidebar()}),this.copyBtn.addEventListener("click",()=>this.copyToClipboard()),this.sidebar.querySelector("#zme-clear-btn").addEventListener("click",()=>{this.options.onClear(),this.updateMessages([]),this.showToast("Đã xóa hết tin nhắn đã chọn")}),this.labelMeInput.addEventListener("input",()=>this.renderPreview()),this.labelCustomerInput.addEventListener("input",()=>this.renderPreview())}toggleSelectMode(){this.isSelectModeActive=!this.isSelectModeActive,this.isSelectModeActive?(document.body.classList.add("zme-select-mode"),this.toggleBtn.classList.add("zme-active"),this.toggleBtn.innerHTML="✅ Đang chọn...",this.openSidebar()):(document.body.classList.remove("zme-select-mode"),this.toggleBtn.classList.remove("zme-active"),this.toggleBtn.innerHTML="✓ Chọn tin nhắn")}openSidebar(){this.isOpen=!0,this.sidebar.classList.add("zme-open")}closeSidebar(){this.isOpen=!1,this.sidebar.classList.remove("zme-open")}updateMessages(e){this.messages=[...e],this.renderPreview(),this.updateCount(),e.length>0&&!this.isOpen&&this.openSidebar()}updateCount(){const e=this.messages.length;this.countEl.textContent=e===0?"Chưa có tin nhắn nào":`${e} tin nhắn đã chọn`}renderPreview(){if(this.messages.length===0){this.previewSection.innerHTML=`
        <div class="zme-empty-state">
          <div class="zme-empty-icon">☑️</div>
          <div class="zme-empty-text">Bật chế độ chọn và tick<br/>vào các tin nhắn bạn muốn</div>
        </div>
      `;return}const e=this.labelMeInput.value.trim()||"me",t=this.labelCustomerInput.value.trim()||"customer",o=[...this.messages].sort((n,a)=>n.timestamp-a.timestamp).map(n=>{const a=n.senderType==="me",m=a?"zme-sender-me":"zme-sender-customer",p=a?e:t,b=this.escapeHtml(n.text);return`<div class="zme-preview-line"><span class="${m}">${p}</span>: ${b}</div>`}).join("");this.previewSection.innerHTML=o}async copyToClipboard(){if(this.messages.length===0){this.showToast("Chưa có tin nhắn nào để copy!");return}const e=this.labelMeInput.value.trim()||"me",t=this.labelCustomerInput.value.trim()||"customer",o=[...this.messages].sort((n,a)=>n.timestamp-a.timestamp).map(n=>`${n.senderType==="me"?e:t}: ${n.text}`).join(`
`);try{await navigator.clipboard.writeText(o),this.copyBtn.textContent="✅ Đã copy!",this.copyBtn.classList.add("zme-copied"),this.showToast("Đã copy hội thoại vào Clipboard!"),setTimeout(()=>{this.copyBtn.textContent="📋 Copy",this.copyBtn.classList.remove("zme-copied")},2e3)}catch{const n=document.createElement("textarea");n.value=o,n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.select(),document.execCommand("copy"),n.remove(),this.showToast("Đã copy hội thoại vào Clipboard!")}}destroy(){var e,t,r,o;(e=document.getElementById(h))==null||e.remove(),(t=document.getElementById(u))==null||t.remove(),(r=document.getElementById("zme-styles"))==null||r.remove(),(o=document.getElementById("zme-toast"))==null||o.remove(),document.body.classList.remove("zme-select-mode")}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}let c=[],l=null,g="",d=null;function x(s){var t;let e=((t=s.innerText)==null?void 0:t.trim())??"";return e?(e=e.replace(/\n\d{1,2}:\d{2}[\s\S]*$/,""),e=e.replace(/\n\d{1,2}:[\s\S]*$/,""),e.trim()):""}function z(){return window.location.href}function C(){const s=document.querySelectorAll(".block-date .chat-item"),e=new Set(c.map(t=>t.id));s.forEach(t=>{const r=t.querySelector(".chat-content");if(!r)return;const o=x(r);if(!o)return;const a=`msg-${t.classList.contains("me")?"me":"cus"}-${o.substring(0,30).replace(/\s+/g,"")}`;t.dataset.zmeId=a,e.has(a)?t.classList.add("zme-selected"):t.classList.remove("zme-selected")})}function S(s){if(!document.body.classList.contains("zme-select-mode"))return;const e=s.target,t=e.closest(".chat-item");if(!t||e.closest("#zme-sidebar"))return;s.preventDefault(),s.stopPropagation();const r=t.querySelector(".chat-content");if(!r)return;const o=x(r);if(!o)return;const n=t.classList.contains("me"),a=n?"me":"customer",m=t.dataset.zmeId||`msg-${n?"me":"cus"}-${o.substring(0,30).replace(/\s+/g,"")}`,p=c.findIndex(b=>b.id===m);p>=0?(c.splice(p,1),t.classList.remove("zme-selected")):(c.push({id:m,senderType:a,text:o,timestamp:Date.now()}),t.classList.add("zme-selected")),l==null||l.updateMessages(c)}function f(){c=[],l==null||l.updateMessages([]),document.querySelectorAll(".zme-selected").forEach(s=>{s.classList.remove("zme-selected")})}function L(s){console.log("[ZME] Conversation changed:",s),f(),l==null||l.showToast("Đã chuyển cuộc trò chuyện — danh sách đã xóa")}function M(){let s=null;new MutationObserver(()=>{s&&cancelAnimationFrame(s),s=requestAnimationFrame(()=>{c.length>0&&C()})}).observe(document.body,{childList:!0,subtree:!0,attributes:!1})}function E(){d==null||d.disconnect();const s=()=>{const e=z();e!==g&&(g=e,L(e))};window.addEventListener("popstate",s),d=new MutationObserver(s),d.observe(document.body,{childList:!0,subtree:!1})}function T(){console.log("[ZME] Zalo Message Exporter v1.1 initializing (Event Delegation Mode)..."),document.body.addEventListener("click",S,{capture:!0}),l=new k({onClear:f}),g=z(),setTimeout(()=>{M(),E(),console.log("[ZME] Ready. Zero-DOM-Injection mode active.")},2e3)}setTimeout(T,1500);
