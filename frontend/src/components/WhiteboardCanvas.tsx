import { Stage, Layer, Line } from "react-konva";
import { useEffect, useState } from "react";
import socket from "../services/socket";
import Toolbar from "../components/Toolbar";
import ChatPanel from "../components/ChatPanel";

interface DrawLine {
  points: number[];
  color: string;
  size: number;
}

interface WhiteboardCanvasProps {
  roomId: string;
}

export default function WhiteboardCanvas({ roomId }: WhiteboardCanvasProps) {
  const [lines, setLines] = useState<DrawLine[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);

  const [chatOpen, setChatOpen] = useState(false);

  // =========================
  // RECEIVE DRAW FROM OTHERS
  // =========================
  useEffect(() => {
    const handleDraw = (line: DrawLine) => {
      setLines((prev) => [...prev, line]);
    };

    socket.on("draw", handleDraw);

    return () => {
      socket.off("draw", handleDraw);
    };
  }, []);

  // =========================
  // START DRAWING
  // =========================
  const handleMouseDown = (e: any) => {
    setIsDrawing(true);

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const newLine: DrawLine = {
      points: [pos.x, pos.y],
      color,
      size,
    };

    setLines((prev) => [...prev, newLine]);
  };

  // =========================
  // DRAWING MOVE (FIXED IMMUTABLE)
  // =========================
  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    setLines((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (!last) return prev;

      updated[updated.length - 1] = {
        ...last,
        points: [...last.points, point.x, point.y],
      };

      return updated;
    });
  };

  // =========================
  // STOP DRAW + EMIT TO SERVER
  // =========================
  const handleMouseUp = () => {
    setIsDrawing(false);

    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    socket.emit("draw", {
      roomId,
      line: lastLine,
    });
  };

  // =========================
  // ACTIONS
  // =========================
  const undo = () => setLines((prev) => prev.slice(0, -1));

  const clearBoard = () => setLines([]);

  const saveImage = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>

      {/* ================= TOOLBAR ================= */}
      <Toolbar
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        undo={undo}
        clearBoard={clearBoard}
        saveImage={saveImage}
      />

      {/* ================= CHAT DRAWER ================= */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: chatOpen ? 0 : "-320px",
          width: "320px",
          height: "100vh",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          boxShadow: "2px 0 20px rgba(0,0,0,0.2)",
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
          transition: "0.3s ease",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px",
            borderBottom: "1px solid #ddd",
            fontWeight: 600,
          }}
        >
          💬 Chat
          <button
            onClick={() => setChatOpen(false)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>

        {/* Chat Body */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ChatPanel roomId={roomId} />
        </div>
      </div>

      {/* ================= CHAT BUTTON ================= */}
      {!chatOpen && (
        <div
          onClick={() => setChatOpen(true)}
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#0d6efd",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            zIndex: 30,
          }}
        >
          💬
        </div>
      )}

      {/* ================= CANVAS ================= */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.size}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>

    </div>
  );
}