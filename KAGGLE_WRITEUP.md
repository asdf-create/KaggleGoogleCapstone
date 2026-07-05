# StudyMate AI: An Autonomous Multi-Agent Learning Manager

**Track:** Concierge Agents  
**Project Link:** [GitHub Repository](https://github.com/example/studymate-ai)  
**Video Demonstration:** [YouTube Video Link](https://youtube.com/watch?v=example)  

---

## 💡 Problem Statement

Students and self-learners today face an acute problem of **cognitive fragmentation**. When preparing for exams, tech interviews, or learning complex subjects like Machine Learning, they spend more time **managing learning** than actually learning.

Learners constantly context-switch across disconnected tools:
- ChatGPT for quick concept explanations
- YouTube for video lectures
- Notion or Obsidian for notes
- Google Calendar for scheduling
- Quizlet for flashcards
- GitHub for code samples and exercises

This leads to organization fatigue, passive reading without retention, and static study plans that never adapt when a student struggles with specific concepts.

---

## 🚀 The Solution: StudyMate AI

**StudyMate AI** shifts the paradigm from a passive Q&A chatbot to an **autonomous, closed-loop AI learning companion**.

Instead of merely answering questions, StudyMate AI **acts**:
1. **Plans**: Takes a high-level goal (e.g., "Prepare for ML Summer School in 30 days") and autonomously creates a structured, day-by-day roadmap.
2. **Researches**: Invokes **MCP tools** to search the web, local filesystem notes, GitHub repositories, and educational YouTube lectures.
3. **Navigates Transcripts**: Displays embedded YouTube video tutorials paired with an **interactive navigable transcript panel** where clicking any timestamp line instantly jumps the video player.
4. **Teaches**: Explains concepts tailored to the user's historical weak spots and preferred difficulty level.
5. **Evaluates**: Generates multi-choice and coding quizzes to test active recall.
6. **Adapts**: Performs **closed-loop replanning**—if a student scores poorly on a quiz, StudyMate AI automatically adjusts future roadmap days, schedules revision sessions, and pulls additional YouTube deep-dive lectures.

---

## 🛠️ Architecture & Technical Implementation

StudyMate AI uses a modern, high-performance hybrid architecture that pairs a **C++23 REST backend** with a **Google ADK Python microservice** and a **Next.js 15 (Bun) AI Lab UI**.

### 1. C++23 REST Backend (`cpp-httplib` + `nlohmann/json` + `sqlite3`)
- **Performance & Simplicity**: Built using the **Ponytail harness philosophy**—favoring standard libraries, header-only utilities (`cpp-httplib`, `nlohmann/json`), and zero unnecessary bloat.
- **SQLite DAO Layer**: Persists study plans, daily schedules, quiz questions, results, and Antigravity execution traces.
- **REST Endpoints**:
  - `POST /api/goals`: Triggers roadmap creation.
  - `POST /api/tutor/explain`: Generates concept explanations.
  - `POST /api/quiz/generate` & `POST /api/quiz/submit`: Manages assessment & closed-loop adaptation.
  - `POST /api/research`: Queries YouTube videos & timestamped transcripts.
  - `GET /api/antigravity/traces`: Streams live agent execution traces.

### 2. Multi-Agent ADK Microservice (Google ADK + Gemini API)
Built with `google-genai` and FastAPI (managed via `uv`), featuring six specialized subagents:
- **Coordinator Agent**: Routes incoming requests and coordinates subagent communication.
- **Planner Agent**: Generates structured time-bound roadmaps.
- **Tutor Agent**: Provides context-aware concept explanations.
- **Research Agent**: Integrates Model Context Protocol (MCP) tools to query YouTube videos, transcripts, and web resources.
- **Quiz Agent**: Generates adaptive questions and explanations.
- **Progress/Replanner Agent**: Evaluates quiz performance and dynamically updates study roadmaps.

### 3. Frontend (Next.js 15 + Bun + Tailwind CSS + Recharts)
Designed with a sleek **AI Lab aesthetic**, featuring dark glassmorphism, glowing micro-animations, Recharts progress analytics, an interactive YouTube transcript player, and a live **Antigravity execution visualizer**.

---

## 🎓 Kaggle Course Concepts Demonstrated

1. **Multi-Agent System (ADK)**: Clear separation of responsibilities across Coordinator, Planner, Tutor, Research, Quiz, and Progress agents.
2. **MCP Servers**: Interoperable tool usage across Filesystem, Web Search, GitHub, and Notes MCP servers.
3. **Antigravity**: Visualized subagent execution graphs and log streams directly in the UI dashboard and CLI.
4. **Security Features**: Strict `.env` secret isolation, input sanitization, permission guards on tool access.
5. **Deployability**: Complete multi-container `docker-compose.yml` for single-command deployment.
6. **Agent Skills / CLI**: Full-featured `studymate` CLI supporting terminal plan creation, quizzes, and concept explanations (`studymate explain`).

---

## 🏆 Key Takeaways & Value

StudyMate AI proves that AI agents excel when they move beyond conversational text to **autonomous, closed-loop execution**. By combining C++ performance, Google ADK multi-agent orchestration, MCP tool access, and interactive video transcript navigation, StudyMate AI delivers a portfolio-ready solution for the future of learning.
