import { useState } from "react";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { getAvailableThemes } from "@jdi/shared/src/themes";
import { ThemeUploader } from "./components/ThemeUploader";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useSocketEvent } from "../../hooks/useSocketEvent";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { DEFAULT_MAX_ROUNDS } from "@jdi/shared/src/constants";

// Imports do Design System
import { PageContainer } from "../../components/Page/PageContainer";
import { Card } from "../../components/Card/Card";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { Input } from "../../components/Input/Input"; // Usaremos para o número de rodadas
import { theme } from "../../styles/theme";

const AVAILABLE_THEMES = getAvailableThemes();

const WaitingRoomScreen = () => {
  const { room, me, startGame, leaveRoom, gameState } = useGame();

  // STATES
  const [availableThemes, setAvailableThemes] = useState<string[]>(AVAILABLE_THEMES);
  const [selectedTheme, setSelectedTheme] = useState(AVAILABLE_THEMES[0]);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [preferredMaxRounds, setPreferredMaxRounds] = useLocalStorage(
    "jdi_preferred_max_rounds",
    DEFAULT_MAX_ROUNDS
  );

  // EFFECTS
  useSocketEvent<string[]>("themes_updated", (newThemes) => {
    if (!Array.isArray(newThemes)) return;
    const uniqueThemes = Array.from(new Set([...AVAILABLE_THEMES, ...newThemes]));
    setAvailableThemes(uniqueThemes);
    if (newThemes.length > 0) {
      setSelectedTheme(newThemes[newThemes.length - 1]);
    }
  });

  const handleStartGame = () => {
    if (room && room.players.length < 3) { // Geralmente impostor precisa de min 3
       // Mas mantendo sua lógica de 2:
       if (room.players.length < 2) {
          toast.error("Mínimo de 2 jogadores!");
          return;
       }
    }
    startGame(selectedTheme, preferredMaxRounds);
  };

  const copyToClipboard = useCopyToClipboard();

  if (!room || !me) return <PageContainer><div>Carregando...</div></PageContainer>;

  return (
    <PageContainer>
      {/* MODAL */}
      {showThemeModal && (
        <ThemeUploader onClose={() => setShowThemeModal(false)} />
      )}

      {/* CABEÇALHO: CÓDIGO DA SALA */}
      <div style={{ textAlign: "center", marginBottom: theme.spacing.m }}>
        <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.xs, fontSize: theme.fontSize.s, letterSpacing: "1px", textTransform: "uppercase" }}>
          SALA DE ESPERA
        </p>
        
        <div 
          onClick={() => copyToClipboard.copy(room.id)}
          title="Clique para copiar"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `2px dashed ${theme.colors.border}`,
            borderRadius: theme.borderRadius.l,
            padding: `${theme.spacing.s} ${theme.spacing.l}`,
            display: "inline-block",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
             e.currentTarget.style.borderColor = theme.colors.primary;
             e.currentTarget.style.background = "rgba(34, 197, 94, 0.1)";
          }}
          onMouseLeave={(e) => {
             e.currentTarget.style.borderColor = theme.colors.border;
             e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
        >
          <h1 style={{ 
            margin: 0, 
            fontSize: "3rem", 
            color: theme.colors.primary, 
            letterSpacing: "6px",
            fontFamily: "monospace" // Fonte monoespaçada fica legal para códigos
          }}>
            {room.id}
          </h1>
          <span style={{ fontSize: "10px", color: theme.colors.text.secondary }}>
            CLIQUE PARA COPIAR
          </span>
        </div>
      </div>

      {/* LISTA DE JOGADORES */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.m }}>
          <h3 style={{ margin: 0, color: theme.colors.text.primary }}>
            JOGADORES ({room.players.length})
          </h3>
          {/* Status do Socket Debug opcional */}
          <span style={{ fontSize: "10px", color: theme.colors.text.disabled }}>
            {gameState}
          </span>
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          {room.players.map((player) => (
            <div
              key={player.id}
              style={{
                background: player.id === me.id ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.2)",
                padding: theme.spacing.m,
                borderRadius: theme.borderRadius.m,
                border: player.isHost ? `1px solid ${theme.colors.accent}` : "1px solid transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Avatar simples */}
                <div style={{
                    width: "30px", height: "30px", borderRadius: "50%",
                    background: player.isHost ? theme.colors.accent : theme.colors.surface,
                    color: player.isHost ? "black" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold",
                    fontSize: "14px"
                }}>
                    {player.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: player.id === me.id ? "bold" : "normal" }}>
                  {player.name} {player.id === me.id && "(Você)"}
                </span>
              </div>
              
              {player.isHost && (
                <span style={{ fontSize: "12px", color: theme.colors.accent, fontWeight: "bold" }}>
                  👑 HOST
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* PAINEL DE CONTROLE (HOST ONLY) */}
      {me.isHost ? (
        <Card style={{ border: `1px solid ${theme.colors.primary}` }}>
          <h3 style={{ marginTop: 0, marginBottom: theme.spacing.m, color: theme.colors.primary }}>
            CONFIGURAÇÕES DA PARTIDA
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.m }}>
            {/* TEMA */}
            <div>
              <label style={{ display: "block", fontSize: theme.fontSize.s, color: theme.colors.text.secondary, marginBottom: "5px" }}>
                TEMA
              </label>
              {/* Select Customizado (Simulando o Input visualmente) */}
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                style={{
                  width: "100%",
                  padding: theme.spacing.m,
                  fontSize: theme.fontSize.m,
                  borderRadius: theme.borderRadius.m,
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: "#151515",
                  color: theme.colors.text.primary,
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                {availableThemes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              
              <button 
                onClick={() => setShowThemeModal(true)}
                style={{
                    background: "transparent", border: "none", 
                    color: theme.colors.accent, fontSize: theme.fontSize.s, 
                    marginTop: "5px", cursor: "pointer", textDecoration: "underline"
                }}
              >
                + Criar/Editar Temas
              </button>
            </div>

            {/* RODADAS */}
            <div>
               <label style={{ display: "block", fontSize: theme.fontSize.s, color: theme.colors.text.secondary, marginBottom: "5px" }}>
                MÁXIMO DE RODADAS
              </label>
              <Input
                type="number"
                min={1} max={10}
                value={preferredMaxRounds}
                onChange={(e) => setPreferredMaxRounds(Math.max(1, Math.min(10, Number(e.target.value))))}
                style={{ width: "80px", textAlign: "center" }}
              />
            </div>

            <div style={{ height: "1px", background: theme.colors.border, margin: "10px 0" }} />

            <PrimaryButton 
                onClick={handleStartGame} 
                disabled={room.players.length < 2}
                fullWidth
            >
                {room.players.length < 2 ? "AGUARDANDO JOGADORES..." : "INICIAR JOGO 🚀"}
            </PrimaryButton>
          </div>
        </Card>
      ) : (
        /* MENSAGEM PARA NÃO-HOST */
        <div style={{ textAlign: "center", padding: theme.spacing.l, opacity: 0.7, animation: "pulse 2s infinite" }}>
             <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
             <p>Aguardando o anfitrião iniciar a partida...</p>
        </div>
      )}

      {/* BOTÃO DE SAIR (Geral) */}
      <div style={{ marginTop: theme.spacing.l, display: "flex", justifyContent: "center" }}>
        <PrimaryButton 
            variant="secondary" 
            onClick={leaveRoom}
            style={{ backgroundColor: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 20px" }}
        >
            SAIR DA SALA
        </PrimaryButton>
      </div>

    </PageContainer>
  );
};

export default WaitingRoomScreen;