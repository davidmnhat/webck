import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
// BƯỚC 1: THÊM DÒNG NÀY ĐỂ NHẬP HÌNH ẢNH ROBOT
import robotIcon from '../assets/robot-icon.webp'; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! Mình là AI tư vấn của MY SHOP. Bạn muốn tìm sản phẩm gì hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

    const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/chat', { message: userMsg });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Server AI đang bảo trì rồi!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .chat-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* NÚT BONG BÓNG CHAT */
        .chat-bubble-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ff4d4f;
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(255, 77, 79, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .chat-bubble-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(255, 77, 79, 0.6);
        }
        
        /* BƯỚC 2: THÊM CSS ĐỂ CĂN CHỈNH VÀ ĐẶT KÍCH THƯỚC CHO HÌNH ẢNH ROBOT TRONG NÚT */
        .chat-bubble-btn img {
          width: 40px; /* Đặt chiều rộng cho robot */
          height: 40px; /* Đặt chiều cao cho robot */
          object-fit: contain; /* Đảm bảo hình ảnh không bị méo */
        }

        /* CỬA SỔ CHAT */
        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 5px 25px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform-origin: bottom right;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .chat-header {
          background: #ff4d4f;
          color: #fff;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chat-header h3 { margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .chat-header h3 span { font-size: 12px; background: #fff; color: #ff4d4f; padding: 2px 6px; border-radius: 10px; font-weight: bold; }
        .close-chat-btn { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; }

        .chat-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .msg-row { display: flex; width: 100%; }
        .msg-row.bot { justify-content: flex-start; }
        .msg-row.user { justify-content: flex-end; }

        .msg-bubble {
          max-width: 80%;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.4;
        }
        .msg-row.bot .msg-bubble { background: #fff; border: 1px solid #eee; border-radius: 14px 14px 14px 4px; color: #333; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .msg-row.user .msg-bubble { background: #007bff; color: #fff; border-radius: 14px 14px 4px 14px; }

        .typing-indicator { font-size: 12px; color: #888; margin-left: 8px; font-style: italic; }

        .chat-footer {
          padding: 12px 16px;
          background: #fff;
          border-top: 1px solid #eee;
          display: flex;
          gap: 8px;
        }
        .chat-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
        }
        .chat-input:focus { border-color: #ff4d4f; }
        .send-btn {
          background: #ff4d4f;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .send-btn:hover { background: #d9363e; }
        .send-btn:disabled { background: #ccc; cursor: not-allowed; }
      `}</style>

      <div className="chat-widget">
        {/* KHUNG CHAT KHI MỞ */}
        {isOpen && (
          <div className="chat-window">
            {/* KHUNG CHAT KHI MỞ */}
            <div className="chat-header">
              <h3>
                <img 
                  src={robotIcon} 
                  alt="Robot" 
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                />
                AI Support <span>Beta</span>
              </h3>
              <button className="close-chat-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className="chat-body">
              {messages.map((m, i) => (
                <div key={i} className={`msg-row ${m.sender}`}>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              {isLoading && (
                <div className="msg-row bot">
                  <div className="typing-indicator">AI đang suy nghĩ...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
              <input 
                type="text" 
                className="chat-input"
                placeholder="Nhập câu hỏi..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="send-btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
                ➤
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 3: SỬA CHỖ NÀY ĐỂ THAY ĐỔI EMOJI THÀNH HÌNH ẢNH ROBOT */}
        {!isOpen && (
          <button className="chat-bubble-btn" onClick={() => setIsOpen(true)}>
            
            <img src={robotIcon} alt="Robot Icon" />
          </button>
        )}
      </div>
    </>
  );
};

export default Chatbot;