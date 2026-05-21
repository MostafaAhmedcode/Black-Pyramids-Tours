'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

const FAQS = [
  {
    question: "🚗 Do you offer airport transfer?",
    answer:
      "Yes, we offer premium private airport transfers across Egypt with professional drivers and luxury vehicles."
  },
  {
    question: "🏨 Can you arrange hotel bookings?",
    answer:
      "Absolutely! We arrange hotel bookings in all major destinations across Egypt based on your preferred hotel category and budget."
  },
  {
    question: "🏺 How can I book a private Egypt tour?",
    answer:
      "You can directly book any Egypt tour from our website using the booking form available on every tour page."
  },
  {
    question: "🗺️ Can I customize my tour itinerary?",
    answer:
      "Yes! All tours can be customized based on your interests, travel dates, and budget."
  }
];

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'agent',
      text: "Welcome to Black Pyramids Tours 🔺 How can we help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text,
        time
      }
    ]);

    setInputText('');

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text:
            "Thank you for contacting Black Pyramids Tours. One of our travel agents will reply shortly.",
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    }, 1500);
  };

  const handleFAQClick = (q: string, a: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: q,
        time
      }
    ]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: a,
          time
        }
      ]);
    }, 800);
  };

  return (
    <>
      <div className="support-dock">
        {isOpen && (
          <div className="support-chat-window">
            <div className="support-chat-header">
              <div>
                <div className="support-chat-title">
                  Black Pyramids Tours
                </div>
                <div className="support-chat-status">
                  ● Luxury travel advisor online
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="support-chat-close"
                aria-label="Close live chat"
              >
                ×
              </button>
            </div>

            <div className="support-chat-messages">
              {messages.map((m, idx) => {
                const isAgent = m.sender === 'agent';

                return (
                  <div
                    key={idx}
                    className={`support-message${isAgent ? ' is-agent' : ' is-user'}`}
                  >
                    <div className="support-message-bubble">
                      {m.text}
                    </div>
                    <div className="support-message-time">
                      {m.time}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="support-typing">
                  Typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length < 5 && (
              <div className="support-chat-faq">
                <div className="support-faq-title">
                  Quick Questions
                </div>

                <div className="support-faq-list">
                  {FAQS.map(faq => (
                    <button
                      key={faq.question}
                      onClick={() =>
                        handleFAQClick(
                          faq.question,
                          faq.answer
                        )
                      }
                      className="support-faq-button"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="support-chat-form"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) =>
                  setInputText(e.target.value)
                }
                placeholder="Type your message..."
                className="support-chat-input"
              />

              <button
                type="submit"
                className="support-chat-send"
              >
                Send
              </button>
            </form>
          </div>
        )}

        <div className="support-actions">
          <a
            href="https://wa.me/201211385550"
            target="_blank"
            rel="noopener noreferrer"
            className="support-action support-action--whatsapp"
            aria-label="Contact us on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="currentColor"
              className="support-action-icon"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157z" />
            </svg>
            <span className="support-action-copy">
              WhatsApp
            </span>
          </a>

          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="support-action support-action--chat"
            aria-label={isOpen ? 'Hide live chat' : 'Open live chat'}
          >
            <span className="support-action-icon" aria-hidden="true">💬</span>
            <span className="support-action-copy">
              {isOpen ? 'Hide Chat' : 'Live Agent'}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .support-dock {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 180;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }
        .support-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: stretch;
        }
        .support-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 58px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease, filter 0.28s ease;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
        }
        .support-action:hover {
          transform: translateY(-4px) scale(1.02);
          filter: saturate(1.05);
        }
        .support-action--whatsapp {
          background: linear-gradient(135deg, rgba(33, 193, 96, 0.96), rgba(18, 140, 126, 0.92));
          color: #fff;
          box-shadow: 0 16px 34px rgba(18, 140, 126, 0.34), 0 0 24px rgba(33, 193, 96, 0.22);
        }
        .support-action--whatsapp:hover {
          box-shadow: 0 18px 38px rgba(18, 140, 126, 0.4), 0 0 30px rgba(33, 193, 96, 0.3);
        }
        .support-action--chat {
          background: linear-gradient(135deg, rgba(14, 12, 10, 0.96), rgba(43, 31, 14, 0.92));
          color: var(--gold-light);
          border-color: rgba(201, 168, 76, 0.3);
          box-shadow: 0 16px 34px rgba(0, 0, 0, 0.36), 0 0 28px rgba(201, 168, 76, 0.18);
        }
        .support-action--chat:hover {
          border-color: rgba(223, 202, 125, 0.5);
          box-shadow: 0 18px 38px rgba(0, 0, 0, 0.42), 0 0 34px rgba(201, 168, 76, 0.24);
        }
        .support-action-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          font-size: 1.2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .support-action-copy {
          font-family: ${F};
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .support-chat-window {
          width: min(380px, calc(100vw - 24px));
          height: min(560px, calc(100vh - 144px));
          background: linear-gradient(165deg, rgba(11, 10, 8, 0.97), rgba(19, 15, 10, 0.97));
          border: 1px solid rgba(201, 168, 76, 0.3);
          border-radius: 22px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.6), 0 0 36px rgba(201, 168, 76, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .support-chat-header {
          padding: 18px 20px;
          background: linear-gradient(135deg, rgba(35, 27, 16, 0.96), rgba(10, 10, 10, 0.96));
          border-bottom: 1px solid rgba(201, 168, 76, 0.18);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .support-chat-title {
          color: #fff;
          font-weight: 700;
          font-family: ${F};
        }
        .support-chat-status {
          color: #7ae8bd;
          font-size: 0.72rem;
          margin-top: 4px;
          font-family: ${F};
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .support-chat-close {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(201, 168, 76, 0.18);
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .support-chat-close:hover {
          color: var(--gold);
          border-color: rgba(201, 168, 76, 0.38);
          background: rgba(201, 168, 76, 0.08);
        }
        .support-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .support-message {
          max-width: 86%;
          display: flex;
          flex-direction: column;
        }
        .support-message.is-agent {
          align-self: flex-start;
        }
        .support-message.is-user {
          align-self: flex-end;
        }
        .support-message-bubble {
          padding: 12px 14px;
          border-radius: 16px;
          color: #fff;
          font-family: ${F};
          font-size: 0.86rem;
          line-height: 1.55;
        }
        .support-message.is-agent .support-message-bubble {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .support-message.is-user .support-message-bubble {
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.24), rgba(155, 125, 47, 0.22));
          border: 1px solid rgba(201, 168, 76, 0.18);
        }
        .support-message-time {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.65rem;
          margin-top: 5px;
          font-family: ${F};
        }
        .support-typing {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          font-family: ${F};
        }
        .support-chat-faq {
          padding: 14px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.015);
        }
        .support-faq-title {
          color: var(--gold);
          margin-bottom: 10px;
          font-size: 0.72rem;
          font-family: ${F};
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .support-faq-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .support-faq-button {
          text-align: left;
          padding: 9px 11px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.75rem;
          font-family: ${F};
          transition: all 0.2s ease;
        }
        .support-faq-button:hover {
          border-color: rgba(201, 168, 76, 0.24);
          background: rgba(201, 168, 76, 0.08);
          color: var(--gold-light);
        }
        .support-chat-form {
          padding: 14px;
          display: flex;
          gap: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.18);
        }
        .support-chat-input {
          flex: 1;
          padding: 11px 13px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 12px;
          outline: none;
          font-family: ${F};
          font-size: 0.86rem;
        }
        .support-chat-input:focus {
          border-color: rgba(201, 168, 76, 0.4);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.08);
        }
        .support-chat-send {
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light));
          color: #111;
          border: none;
          padding: 0 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-family: ${F};
          letter-spacing: 0.06em;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .support-chat-send:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(201, 168, 76, 0.25);
        }
        @media (max-width: 768px) {
          .support-dock {
            right: 12px;
            bottom: 12px;
            gap: 12px;
          }
          .support-actions {
            gap: 10px;
          }
          .support-action {
            min-height: 54px;
            padding: 0 14px;
          }
          .support-action-copy {
            font-size: 0.68rem;
            letter-spacing: 0.12em;
          }
          .support-chat-window {
            width: min(360px, calc(100vw - 8px));
            height: min(70vh, 520px);
          }
        }
        @media (max-width: 520px) {
          .support-action-copy {
            display: none;
          }
          .support-action {
            width: 54px;
            height: 54px;
            padding: 0;
            border-radius: 999px;
          }
          .support-chat-window {
            width: calc(100vw - 12px);
            height: min(68vh, 500px);
          }
        }
      `}</style>
    </>
  );
}
