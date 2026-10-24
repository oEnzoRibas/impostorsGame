# 🕵️‍♂️ The Impostor Game
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/oEnzoRibas/impostorsGame)
## A real-time multiplayer social deduction game where players must find out who doesn't know the secret word.

# 📖 About the Project
The Impostor Game is a web-based party game inspired by the TikTok trend, "Jogo do Impostor". Players join a room, select a theme, and are assigned a secret word. However, one player (the Impostor) receives no word. Players must take turns giving one-word hints to prove they know the secret, while the Impostor tries to blend in and guess the word. At the end of the rounds, a voting session begins to eliminate the suspected Impostor.

## ✨ Key Features

- Real-Time Gameplay: Instant communication using Socket.io.
- Room System: Create private rooms and invite friends via code.
- Theme Management:
  - Built-in themes (Animals, Countries, Objects, etc.).
  - Custom Themes: Users can create and play with their own word sets.
- Dynamic UI: Responsive design with a Dark Mode theme.
- Interactive Gameplay:
    - Speech balloons with history (hover to see previous words).
    - Timed reveal mechanics for words.
- Voting system with visual feedback.
- Resilient State: Game state is managed via Redis to handle disconnects/reconnects.

## 🛠️ Tech Stack

- This project is built as a Monorepo using TypeScript.

- Frontend (/frontend)
    - Framework: React + Vite
    - Styling: CSS-in-JS (Custom Theme System)
    - State Management: Context API + React Hooks
    - Communication: socket.io-client

- Backend (/backend)
  - Runtime: Node.js
  - Real-time: socket.io
  - Database/Cache: Redis (for room and game state)

- Shared (/packages/shared)
  - Shared TypeScript interfaces, types, constants, and default themes between Front and Back.

## 🚀 Getting Started

> Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18 or higher)
- NPM or Yarn

- Docker (required for Redis, or a local Redis instance running)

### Installation
```bash

# Clone the repository


git clone https://github.com/oenzoribas/impostorsGame.git
cd impostorsGame

```

### Install dependencies: (Assuming a root package.json handles workspaces, otherwise install in each folder)

```bash

npm install
```

### Running the Project


Use Docker Compose to run both the backend and frontend along with a Redis instance:

```bash
docker compose up --build
```

Play: Open your browser and go to http://localhost:5173 (or the port shown in your terminal).

### 🎮 How to Play

- Lobby: One player creates a room and shares the ID. Others join.
- Setup: The Host selects a Theme (e.g., Animals) and the number of rounds.

- Roles:

    - Crewmates: Receive a secret word (e.g., "Lion").

    - Impostor: Sees "You are the Impostor".

- Discussion: Players take turns typing one word related to the secret word.

- Crewmate goal: Prove you know the word without being too obvious so the Impostor doesn't guess it.

- Impostor goal: Blend in by typing words that fit the context based on what others said.

- Voting: After the rounds end, players vote for who they think the Impostor is.

Result:

If the Impostor is voted out -> Crewmates Win 🏆

If a Crewmate is voted out -> Impostor Wins 🕵️‍♂️

## 📂 Project Structure

```Plaintext
├── backend
│   ├── src
│   │   ├── config
│   │   ├── modules
│   │   ├── server.ts
│   │   └── socket.ts
├── frontend
│   ├── image
│   │   └── icon.png
│   ├── index.html
├── packages
│   └── shared
│       ├── node_modules
│       ├── package.json
│       └── src
└── README.md
```

## 🤝 Contributing
Contributions are welcome! If you have suggestions for new themes or features:

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

### 📝 License

Distributed under the MIT License. See LICENSE for more information.

> Made with ❤️ by Enzo in Brazil 🇧🇷
