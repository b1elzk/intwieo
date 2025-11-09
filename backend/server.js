// Importar dependências
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// Configurações básicas
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Durante desenvolvimento, libera tudo
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Chave secreta (para testes, depois movemos pro .env)
const SECRET = "segredo123";

// --- SIMULAÇÃO DE USUÁRIOS CADASTRADOS ---
const users = [
  { email: "teste@email.com", password: "123456", name: "Lucas" },
  { email: "admin@email.com", password: "admin", name: "Admin" },
];

// --- LOGIN ---
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const token = jwt.sign({ email: user.email, name: user.name }, SECRET, {
    expiresIn: "2h",
  });

  res.json({ token, user: { email: user.email, name: user.name } });
});

// --- MIDDLEWARE PARA AUTENTICAÇÃO ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token ausente" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
}

// --- ROTA TESTE PROTEGIDA ---
app.get("/perfil", authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.name}!` });
});

// --- CHAT EM TEMPO REAL ---
io.on("connection", (socket) => {
  console.log("🟢 Novo usuário conectado:", socket.id);

  socket.on("mensagem", (msg) => {
    console.log("💬 Mensagem recebida:", msg);
    io.emit("mensagem", msg); // Envia pra todos os conectados
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado:", socket.id);
  });
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
