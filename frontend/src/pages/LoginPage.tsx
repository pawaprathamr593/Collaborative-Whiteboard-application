import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) return;

    localStorage.setItem("username", name);

    navigate("/home");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-dark"
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "350px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-3">
          🎨 Whiteboard Login
        </h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Enter Whiteboard
        </button>

        <p className="text-muted text-center mt-3 small">
          Collaborate in real-time drawing sessions
        </p>
      </div>
    </div>
  );
}