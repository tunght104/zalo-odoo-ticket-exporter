import "./Popup.css";

const Popup = () => {
  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="popup-logo">💬</div>
        <div>
          <h1 className="popup-title">Zalo Exporter</h1>
          <p className="popup-subtitle">Trích xuất tin nhắn hội thoại</p>
        </div>
      </div>

      <div className="popup-body">
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
            <span>Bấm <strong>Copy</strong> trong Sidebar để sao chép</span>
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
