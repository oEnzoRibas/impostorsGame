import { useState } from "react";
import { useGame } from "../../context/GameContext";

const LobbyScreen = () => {
  const { createRoom } = useGame();

  const [nickname, setNickname] = useState("");

  const handleCreateRoom = () => {
    if (nickname.trim() !== "") {
      createRoom(nickname);
    } else {
      alert("Please enter a nickname");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bem-vindo ao Impostor Game 🕵️</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          placeholder="Seu Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button
          onClick={handleCreateRoom}
          style={{ padding: "10px", cursor: "pointer" }}
        >
          Criar Sala
        </button>

        {/* Futuramente aqui entra o botão "Entrar em Sala" */}
      </div>
    </div>
  );
};

export default LobbyScreen;
