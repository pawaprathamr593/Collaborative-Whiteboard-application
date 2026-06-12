import React from "react";

interface ToolbarProps {
  color: string;
  setColor: (c: string) => void;

  size: number;
  setSize: (s: number) => void;

  undo: () => void;
  clearBoard: () => void;
  saveImage: () => void;
}

export default function Toolbar({
  color,
  setColor,
  size,
  setSize,
  undo,
  clearBoard,
  saveImage,
}: ToolbarProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 15,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "10px 16px",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        zIndex: 10,
      }}
    >
      <label>🎨</label>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <label>🖌</label>

      <input
        type="range"
        min="1"
        max="20"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />

      <span>{size}px</span>

      <button className="btn btn-warning btn-sm" onClick={undo}>
        Undo
      </button>

      <button className="btn btn-danger btn-sm" onClick={clearBoard}>
        Clear
      </button>

      <button className="btn btn-success btn-sm" onClick={saveImage}>
        Save
      </button>
    </div>
  );
}