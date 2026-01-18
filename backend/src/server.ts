import express from "express";
import path from "path";
import { createClient } from "redis";
import { createServer } from "http";
import "dotenv/config";
import { setupSocket } from "./socket.js";

const PORT = process.env.BACKEND_PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

async function bootstrap() {
  try {
    console.log("🚀 Iniciando servidor...");

    const app = express();

    // Define onde está a pasta do Frontend (que o Docker copiou)
    const publicPath = path.join(process.cwd(), "public");

    // Serve os arquivos estáticos (JS, CSS, Imagens)
    app.use(express.static(publicPath));

    // --- Conexão Redis ---
    const pubClient = createClient({ url: REDIS_URL });
    pubClient.on("error", (err) => console.error("Redis Error:", err));
    await pubClient.connect();
    console.log(`✅ Redis conectado`);

    // --- Server HTTP + Socket ---
    const httpServer = createServer(app);
    const io = setupSocket(httpServer);

    // 🔥 CORREÇÃO AQUI:
    // Trocamos "*" (string) por /.*/ (Regex)
    // Isso resolve o erro "Missing parameter name at index 1"
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });

    httpServer.listen(PORT, () => {
      console.log(`🔥🔥🔥 Backend rodando na porta ${PORT}`);
      console.log(`📂 Servindo frontend de: ${publicPath}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

bootstrap();
