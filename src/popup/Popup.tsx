import { useState, useEffect } from "react";
import "./Popup.css";

interface AuthStatus {
  loggedIn: boolean;
  email: string | null;
}

const Popup = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check auth status on mount
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_ODOO_AUTH_STATUS" }, (res: AuthStatus) => {
      setAuthStatus(res ?? { loggedIn: false, email: null });
    });
  }, []);

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedKey = apiKey.trim();
    if (!trimmedEmail || !trimmedKey) {
      setErrorMsg("Vui lòng nhập đầy đủ email và API Key.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    chrome.storage.local.set({ odooEmail: trimmedEmail, odooApiKey: trimmedKey }, () => {
      setIsLoading(false);
      setAuthStatus({ loggedIn: true, email: trimmedEmail });
      setEmail("");
      setApiKey("");
    });
  };

  const handleRelogin = () => {
    chrome.storage.local.remove(["odooEmail", "odooApiKey"], () => {
      setAuthStatus({ loggedIn: false, email: null });
      setErrorMsg("");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (authStatus === null) {
    return (
      <div className="popup-container">
        <div className="popup-header">
          <div className="popup-logo">💬</div>
          <div>
            <h1 className="popup-title">Zalo Exporter</h1>
            <p className="popup-subtitle">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      {/* Header */}
      <div className="popup-header">
        <div className="popup-logo">💬</div>
        <div>
          <h1 className="popup-title">Zalo Exporter</h1>
          <p className="popup-subtitle">Trích xuất tin nhắn hội thoại</p>
        </div>
      </div>

      {/* Odoo Auth Section */}
      <div className="popup-section">
        <div className="section-label">🎫 Kết nối Odoo</div>

        {authStatus.loggedIn ? (
          /* Đã đăng nhập */
          <div className="auth-status logged-in">
            <div className="auth-status-icon">✅</div>
            <div className="auth-status-info">
              <div className="auth-status-title">Đã đăng nhập</div>
              <div className="auth-status-email">{authStatus.email}</div>
            </div>
            <button
              id="odoo-relogin-btn"
              className="btn-relogin"
              onClick={handleRelogin}
              title="Đăng nhập lại với tài khoản khác"
            >
              Đổi tài khoản
            </button>
          </div>
        ) : (
          /* Chưa đăng nhập */
          <div className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="odoo-email">Email Odoo</label>
              <input
                id="odoo-email"
                className="form-input"
                type="email"
                placeholder="you@mindx.com.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="odoo-api-key">
                API Key
                <a
                  className="form-hint-link"
                  href="https://hrm.mindx.edu.vn/odoo/helpdesk"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Lấy API Key bằng cách click vào avatar → Tùy chọn của tôi → Bảo mật → Thêm khóa API"
                >
                  ?
                </a>
              </label>
              <input
                id="odoo-api-key"
                className="form-input"
                type="password"
                placeholder="Nhập API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>
            {errorMsg && <div className="form-error">{errorMsg}</div>}
            <button
              id="odoo-login-btn"
              className="btn-login"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Đăng nhập"}
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="popup-section">
        <div className="section-label">📖 Hướng dẫn</div>
        <div className="popup-instruction">
          <div className="step">
            <span className="step-number">1</span>
            <span>Mở <strong>chat.zalo.me</strong></span>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <span>Bấm nút <strong>✓ Chọn tin nhắn</strong> ở góc màn hình</span>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <span>Tick vào các tin nhắn muốn chọn</span>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <span>Điền thông tin và bấm <strong>🎫 Tạo Ticket</strong></span>
          </div>
        </div>
      </div>

      <div className="popup-footer">
        <a
          href="https://chat.zalo.me"
          target="_blank"
          rel="noopener noreferrer"
          className="popup-link"
        >
          Mở Zalo Web →
        </a>
      </div>
    </div>
  );
};

export default Popup;
