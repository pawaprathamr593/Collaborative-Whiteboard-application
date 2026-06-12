import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import socket from "../services/socket";
import WhiteboardCanvas from "../components/WhiteboardCanvas";

export default function WhiteboardPage() {
  const { id } = useParams();
  const [users, setUsers] = useState(0);

  useEffect(() => {
    if (!id) return;

    socket.emit("join-room", id);

    const handleUsers = (count: number) => {
      setUsers(count);
    };

    socket.on("user-count", handleUsers);

    return () => {
      socket.off("user-count", handleUsers);
    };
  }, [id]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f4f6f8",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "#111827",
          color: "white",
          fontWeight: 500,
        }}
      >
        <div>🎨 Whiteboard Session</div>

        <div style={{ display: "flex", gap: "16px" }}>
          <span>Session: {id}</span>
          <span>👥 Users: {users}</span>
        </div>
      </div>

      {/* CANVAS AREA */}
      <div style={{ flex: 1, position: "relative" }}>
        <WhiteboardCanvas roomId={id || ""} />
      </div>
    </div>
  );
}