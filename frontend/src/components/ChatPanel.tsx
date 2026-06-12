import { useEffect, useRef, useState } from "react";
import socket from "../services/socket";

interface ChatMessage {
  text: string;
  self: boolean;
}

export default function ChatPanel({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const username = localStorage.getItem("username") || "User";

  // RECEIVE MESSAGES
  useEffect(() => {
    const handleReceive = (data: {
      message: string;
      sender: string;
      socketId: string;
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          self: data.sender === username,
        },
      ]);
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [username]);

  // AUTO SCROLL
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      message: `${username}: ${message}`,
      sender: username,
    });

    setMessage("");
  };

  return (
    <div
      style={{
        width: "320px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(14px)",
        borderLeft: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "12px",
          fontWeight: 600,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        💬 Live Chat
      </div>

      {/* MESSAGES */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.self
                ? "flex-end"
                : "flex-start",
              maxWidth: "80%",
              padding: "10px 12px",
              borderRadius: msg.self
                ? "14px 14px 4px 14px"
                : "14px 14px 14px 4px",
              background: msg.self
                ? "#0d6efd"
                : "#f1f3f5",
              color: msg.self ? "white" : "#111",
              fontSize: "13px",
              wordBreak: "break-word",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "10px",
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <input
          value={message}
          placeholder="Type message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.15)",
            outline: "none",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "none",
            background: "#0d6efd",
            color: "white",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}