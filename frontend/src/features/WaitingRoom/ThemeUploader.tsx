import type { ChangeEvent } from "react";
import { socketService } from "../../services/socket";
import toast from "react-hot-toast";

export const ThemeUploader = () => {
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verifica extensão
    if (!file.name.endsWith(".json")) {
      toast.error("Por favor, envie um arquivo .json");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target?.result as string);

        // Validação simples: vê se é um objeto e se valores são arrays
        const isValid = Object.values(jsonContent).every((val) =>
          Array.isArray(val)
        );

        if (!isValid) {
          throw new Error(
            "Formato inválido! Use: { 'Tema': ['Palavra1', 'Palavra2'] }"
          );
        }

        // Envia pro Backend
        socketService.socket?.emit("upload_custom_themes", {
          themes: jsonContent,
        });
      } catch (err) {
        toast.error("Erro ao ler JSON. Verifique a formatação.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <label
        htmlFor="json-upload"
        style={{
          cursor: "pointer",
          color: "#60a5fa",
          textDecoration: "underline",
          fontSize: "14px",
        }}
      >
        📂 Carregar temas personalizados (.json)
      </label>
      <input
        id="json-upload"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};
