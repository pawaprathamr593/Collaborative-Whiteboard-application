import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    navigate(`/whiteboard/${id}`);
  };

  const joinRoom = () => {
    if (!room.trim()) return;
    navigate(`/whiteboard/${room}`);
  };

  return (
    <div className="container-fluid vh-100 bg-light d-flex flex-column justify-content-center align-items-center">

      <h1 className="mb-4 fw-bold">
        🧑‍🎨 Collaborative Whiteboard
      </h1>

      <div className="row gap-4">

        {/* Create Room */}
        <div className="col-md-5">
          <div className="card shadow p-4 text-center">
            <h4>Create Session</h4>
            <p className="text-muted">
              Start a new collaboration room
            </p>

            <button
              className="btn btn-success w-100"
              onClick={createRoom}
            >
              Create Room
            </button>
          </div>
        </div>

        {/* Join Room */}
        <div className="col-md-5">
          <div className="card shadow p-4 text-center">
            <h4>Join Session</h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />

            <button
              className="btn btn-primary w-100"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
        </div>

      </div>

      <p className="text-muted mt-4">
        Real-time collaboration with drawing + chat
      </p>

    </div>
  );
}