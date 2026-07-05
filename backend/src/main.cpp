#include <iostream>
#include <memory>
#include <cstdlib>
#include <httplib.h>
#include "database/db.hpp"
#include "agents/agent_bridge.hpp"
#include "api/routes.hpp"

int main() {
    std::cout << "============================================" << std::endl;
    std::cout << "  StudyMate AI - C++ REST Backend Server    " << std::endl;
    std::cout << "============================================" << std::endl;

    const char* port_env = std::getenv("CPP_BACKEND_PORT");
    int port = port_env ? std::atoi(port_env) : 8080;

    const char* python_adk_env = std::getenv("PYTHON_ADK_URL");
    std::string python_adk_url = python_adk_env ? std::string(python_adk_env) : "http://localhost:5000";

    auto db = std::make_shared<studymate::Database>("studymate.db");
    if (!db->init()) {
        std::cerr << "[Fatal] Could not initialize SQLite database." << std::endl;
        return 1;
    }
    std::cout << "[Database] SQLite initialized successfully." << std::endl;

    auto bridge = std::make_shared<studymate::AgentBridge>(db, python_adk_url);
    studymate::Routes routes(db, bridge);

    httplib::Server svr;
    routes.setup_routes(svr);

    std::cout << "[Server] Listening on http://0.0.0.0:" << port << std::endl;
    std::cout << "[Agent Bridge] Connected to Python ADK service at: " << python_adk_url << std::endl;

    if (!svr.listen("0.0.0.0", port)) {
        std::cerr << "[Fatal] Failed to bind to port " << port << std::endl;
        return 1;
    }

    return 0;
}
