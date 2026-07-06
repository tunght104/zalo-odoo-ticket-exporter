var C=Object.defineProperty;var T=(n,e,t)=>e in n?C(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var r=(n,e,t)=>T(n,typeof e!="symbol"?e+"":e,t);const u="zme-sidebar",g="zme-toggle-btn",x="zme-toast",f="zme-styles",v={CHAT_ITEMS:".block-date .chat-item",CHAT_CONTENT:".chat-content",ME_CLASS:"me"},a={SELECT_MODE:"zme-select-mode",SELECTED:"zme-selected",SIDEBAR_OPEN:"zme-open",TOGGLE_ACTIVE:"zme-active",COPIED:"zme-copied",TOAST_SHOW:"zme-show"},M=1500,L=2e3,k=2500,I=2e3;class A{getAllChatItems(){return document.querySelectorAll(v.CHAT_ITEMS)}extractCleanText(e){var s;let t=((s=e.innerText)==null?void 0:s.trim())??"";return t?(t=t.replace(/\n\d{1,2}:\d{2}[\s\S]*$/,""),t=t.replace(/\n\d{1,2}:[\s\S]*$/,""),t.trim()):""}parseChatItem(e){const t=e.querySelector(v.CHAT_CONTENT);if(!t)return null;const s=this.extractCleanText(t);return s?{element:e,text:s,isMe:e.classList.contains(v.ME_CLASS)}:null}generateMessageId(e,t){const s=e?"me":"cus",o=this.simpleHash(t);return`msg-${s}-${o}`}getCurrentConversationKey(){return window.location.href}simpleHash(e){let t=0;for(let s=0;s<e.length;s++){const o=e.charCodeAt(s);t=(t<<5)-t+o,t|=0}return Math.abs(t).toString(36)}}class _{constructor(e,t){r(this,"selectedMessages",[]);r(this,"domParser");r(this,"onChange");this.domParser=e,this.onChange=t}toggle(e){const t=this.domParser.parseChatItem(e);if(!t)return!1;const s=this.domParser.generateMessageId(t.isMe,t.text);e.dataset.zmeId=s;const o=this.selectedMessages.findIndex(i=>i.id===s);return o>=0?(this.selectedMessages.splice(o,1),e.classList.remove(a.SELECTED),this.onChange(this.selectedMessages),!1):(this.selectedMessages.push({id:s,senderType:t.isMe?"me":"customer",text:t.text,selectedAt:Date.now()}),e.classList.add(a.SELECTED),this.onChange(this.selectedMessages),!0)}syncSelectionState(){const e=this.domParser.getAllChatItems(),t=new Set(this.selectedMessages.map(s=>s.id));e.forEach(s=>{const o=this.domParser.parseChatItem(s);if(!o)return;const i=this.domParser.generateMessageId(o.isMe,o.text);s.dataset.zmeId=i,t.has(i)?s.classList.add(a.SELECTED):s.classList.remove(a.SELECTED)})}clear(){this.selectedMessages=[],document.querySelectorAll(`.${a.SELECTED}`).forEach(e=>{e.classList.remove(a.SELECTED)}),this.onChange(this.selectedMessages)}getMessages(){return[...this.selectedMessages]}hasSelections(){return this.selectedMessages.length>0}}const B=`
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
`;class O{constructor(){r(this,"toast");this.toast=this.createToast()}createToast(){const e=document.getElementById(x);e&&e.remove();const t=document.createElement("div");return t.id=x,document.body.appendChild(t),t}show(e){this.toast.textContent=e,this.toast.classList.add(a.TOAST_SHOW),setTimeout(()=>this.toast.classList.remove(a.TOAST_SHOW),k)}destroy(){var e;(e=document.getElementById(x))==null||e.remove()}}class D{formatAsText(e,t,s){return[...e].sort((i,l)=>i.selectedAt-l.selectedAt).map(i=>`${i.senderType==="me"?t:s}: ${i.text}`).join(`
`)}formatAsHtml(e,t,s){return[...e].sort((i,l)=>i.selectedAt-l.selectedAt).map(i=>{const l=i.senderType==="me",E=l?"zme-sender-me":"zme-sender-customer",S=l?t:s,w=this.escapeHtml(i.text);return`<div class="zme-preview-line"><span class="${E}">${S}</span>: ${w}</div>`}).join("")}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}function H(){return`
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
  `}const P=`
  <div class="zme-empty-state">
    <div class="zme-empty-icon">☑️</div>
    <div class="zme-empty-text">Bật chế độ chọn và tick<br/>vào các tin nhắn bạn muốn</div>
  </div>
`;class N{constructor(e){r(this,"sidebar",null);r(this,"toggleBtn",null);r(this,"previewSection",null);r(this,"labelMeInput",null);r(this,"labelCustomerInput",null);r(this,"countEl",null);r(this,"copyBtn",null);r(this,"isOpen",!1);r(this,"_isSelectModeActive",!1);r(this,"messages",[]);r(this,"options");r(this,"toast");r(this,"formatter");this.options=e,this.toast=new O,this.formatter=new D,this.injectStyles(),this.createToggleButton(),this.createSidebar()}get isSelectModeActive(){return this._isSelectModeActive}injectStyles(){if(document.getElementById(f))return;const e=document.createElement("style");e.id=f,e.textContent=B,document.head.appendChild(e)}createToggleButton(){const e=document.getElementById(g);e&&e.remove(),this.toggleBtn=document.createElement("button"),this.toggleBtn.id=g,this.toggleBtn.innerHTML="✓ Chọn tin nhắn",this.toggleBtn.addEventListener("click",()=>this.toggleSelectMode()),document.body.appendChild(this.toggleBtn)}createSidebar(){var t,s,o,i,l;const e=document.getElementById(u);e&&e.remove(),this.sidebar=document.createElement("div"),this.sidebar.id=u,this.sidebar.innerHTML=H(),document.body.appendChild(this.sidebar),this.previewSection=this.querySelector("#zme-preview"),this.labelMeInput=this.querySelector("#zme-label-me"),this.labelCustomerInput=this.querySelector("#zme-label-customer"),this.countEl=this.querySelector("#zme-count"),this.copyBtn=this.querySelector("#zme-copy-btn"),(t=this.querySelector("#zme-close-btn"))==null||t.addEventListener("click",()=>this.closeSidebar()),(s=this.copyBtn)==null||s.addEventListener("click",()=>this.copyToClipboard()),(o=this.querySelector("#zme-clear-btn"))==null||o.addEventListener("click",()=>{this.options.onClear(),this.updateMessages([]),this.showToast("Đã xóa hết tin nhắn đã chọn")}),(i=this.labelMeInput)==null||i.addEventListener("input",()=>this.renderPreview()),(l=this.labelCustomerInput)==null||l.addEventListener("input",()=>this.renderPreview())}querySelector(e){var t;return((t=this.sidebar)==null?void 0:t.querySelector(e))??null}toggleSelectMode(){var e,t;this._isSelectModeActive=!this._isSelectModeActive,this._isSelectModeActive?(document.body.classList.add(a.SELECT_MODE),(e=this.toggleBtn)==null||e.classList.add(a.TOGGLE_ACTIVE),this.toggleBtn&&(this.toggleBtn.innerHTML="✅ Đang chọn..."),this.openSidebar()):(document.body.classList.remove(a.SELECT_MODE),(t=this.toggleBtn)==null||t.classList.remove(a.TOGGLE_ACTIVE),this.toggleBtn&&(this.toggleBtn.innerHTML="✓ Chọn tin nhắn"))}openSidebar(){var e;this.isOpen=!0,(e=this.sidebar)==null||e.classList.add(a.SIDEBAR_OPEN)}closeSidebar(){var e;this.isOpen=!1,(e=this.sidebar)==null||e.classList.remove(a.SIDEBAR_OPEN)}updateMessages(e){this.messages=[...e],this.renderPreview(),this.updateCount(),e.length>0&&!this.isOpen&&this.openSidebar()}updateCount(){if(!this.countEl)return;const e=this.messages.length;this.countEl.textContent=e===0?"Chưa có tin nhắn nào":`${e} tin nhắn đã chọn`}renderPreview(){var s,o;if(!this.previewSection)return;if(this.messages.length===0){this.previewSection.innerHTML=P;return}const e=((s=this.labelMeInput)==null?void 0:s.value.trim())||"me",t=((o=this.labelCustomerInput)==null?void 0:o.value.trim())||"customer";this.previewSection.innerHTML=this.formatter.formatAsHtml(this.messages,e,t)}async copyToClipboard(){var o,i;if(this.messages.length===0){this.showToast("Chưa có tin nhắn nào để copy!");return}const e=((o=this.labelMeInput)==null?void 0:o.value.trim())||"me",t=((i=this.labelCustomerInput)==null?void 0:i.value.trim())||"customer",s=this.formatter.formatAsText(this.messages,e,t);try{await navigator.clipboard.writeText(s),this.showCopySuccess()}catch{const l=document.createElement("textarea");l.value=s,l.style.position="fixed",l.style.opacity="0",document.body.appendChild(l),l.select(),document.execCommand("copy"),l.remove(),this.showCopySuccess()}}showCopySuccess(){this.copyBtn&&(this.copyBtn.textContent="✅ Đã copy!",this.copyBtn.classList.add(a.COPIED),setTimeout(()=>{this.copyBtn&&(this.copyBtn.textContent="📋 Copy",this.copyBtn.classList.remove(a.COPIED))},I)),this.showToast("Đã copy hội thoại vào Clipboard!")}showToast(e){this.toast.show(e)}destroy(){var e,t,s;(e=document.getElementById(u))==null||e.remove(),(t=document.getElementById(g))==null||t.remove(),(s=document.getElementById(f))==null||s.remove(),document.body.classList.remove(a.SELECT_MODE),this.toast.destroy()}}let h,c,b,z="",d=null,p=null,m=null;function q(n){if(!document.body.classList.contains(a.SELECT_MODE))return;const e=n.target,t=e.closest(".chat-item");t&&(e.closest("#zme-sidebar")||(n.preventDefault(),n.stopPropagation(),c.toggle(t),b.updateMessages(c.getMessages())))}function y(){c.clear(),b.updateMessages([])}function Y(n){console.log("[ZME] Conversation changed:",n),y(),b.showToast("Đã chuyển cuộc trò chuyện — danh sách đã xóa")}function R(){d==null||d.disconnect();let n=null;d=new MutationObserver(()=>{n&&cancelAnimationFrame(n),n=requestAnimationFrame(()=>{c.hasSelections()&&c.syncSelectionState()})}),d.observe(document.body,{childList:!0,subtree:!0,attributes:!1})}function $(){p==null||p.disconnect(),m&&window.removeEventListener("popstate",m);const n=()=>{const e=h.getCurrentConversationKey();e!==z&&(z=e,Y(e))};m=n,window.addEventListener("popstate",m),p=new MutationObserver(n),p.observe(document.body,{childList:!0,subtree:!1})}function G(n){}function j(){console.log("[ZME] Zalo Message Exporter v2.0 initializing..."),h=new A,c=new _(h,G),b=new N({onClear:y}),document.body.addEventListener("click",q,{capture:!0}),z=h.getCurrentConversationKey(),setTimeout(()=>{R(),$(),console.log("[ZME] Ready. Modular architecture active.")},L)}setTimeout(j,M);
