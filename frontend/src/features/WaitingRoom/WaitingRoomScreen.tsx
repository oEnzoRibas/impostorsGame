import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { socketService } from "../../services/socket"; // Importar socket para ouvir temas novos

// Temas Padrão
const DEFAULT_THEMES = ["ANIMAIS", "PAISES", "COMIDA", "OBJETOS", "PROFISSOES"];

const WaitingRoomScreen = () => {
  const { room, me, startGame, leaveRoom } = useGame();

  // 👇 ESTADO DO TEMA (Faltava isso!)
  const [availableThemes, setAvailableThemes] =
    useState<string[]>(DEFAULT_THEMES);
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEMES[0]);

  // Listener para novos temas (Upload)
  useEffect(() => {
    socketService.socket?.on("themes_updated", (customThemeNames: string[]) => {
      setAvailableThemes([...DEFAULT_THEMES, ...customThemeNames]);
      toast.success("Novos temas adicionados!");
      if (customThemeNames.length > 0) setSelectedTheme(customThemeNames[0]);
    });
    return () => {
      socketService.socket?.off("themes_updated");
    };
  }, []);

  const handleStartGame = () => {
    if (room && room.players.length < 2) {
      // Mínimo de jogadores (ajuste se quiser 3)
      toast.error("É necessário pelo menos 2 jogadores para iniciar.");
      return;
    }
    // 👇 Passa o tema selecionado
    startGame(selectedTheme);
  };

  if (!room || !me) return <div>Carregando...</div>;

  const copyToClipboard = async () => {
    const textToCopy = room.id;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast.success("Código copiado!");
        return;
      } catch (err) {
        console.error(err);
      }
    }
    // Fallback manual
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("Código copiado!");
    } catch (err) {
      toast.error("Copie manualmente: " + textToCopy);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
      <h1>Sala de Espera</h1>

      {/* CÓDIGO DA SALA */}
      <div
        style={{
          margin: "20px 0",
          padding: "20px",
          background: "#333",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#aaa" }}>CÓDIGO:</p>
        <h2
          onClick={copyToClipboard}
          style={{
            margin: "5px 0",
            fontSize: "40px",
            letterSpacing: "5px",
            cursor: "pointer",
            color: "#4ade80",
          }}
          title="Clique para copiar"
        >
          {room.id}
        </h2>
      </div>

      <h2>Jogadores ({room.players.length})</h2>

      {/* LISTA DE JOGADORES */}
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {room.players.map((player) => (
            <li
              key={player.id}
              style={{
                background: player.id === me?.id ? "#444" : "#222",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: player.isHost ? "1px solid gold" : "none",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {player.name} {player.id === me?.id && "(Você)"}
              </span>
              {player.isHost && <span style={{ color: "gold" }}>👑 Host</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* ÁREA DE CONTROLES (HOST) */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* SELETOR DE TEMA (Só aparece para o Host) */}
        {me?.isHost && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label>Escolha o Tema:</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                fontSize: "16px",
                minWidth: "200px",
              }}
            >
              {availableThemes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {/* Aqui você pode por o componente <ThemeUploader /> se tiver criado */}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={leaveRoom}
            style={{
              padding: "10px 20px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>

          {me?.isHost ? (
            <button
              onClick={handleStartGame} // Usa a função handle que valida e envia o tema
              disabled={room.players.length < 2}
              style={{
                padding: "10px 20px",
                background: room.players.length < 2 ? "#555" : "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: room.players.length < 2 ? "not-allowed" : "pointer",
              }}
            >
              {room.players.length < 2
                ? "Aguardando Jogadores..."
                : "Iniciar Jogo 🚀"}
            </button>
          ) : (
            <p style={{ color: "#aaa" }}>Aguardando o Host iniciar...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomScreen;
