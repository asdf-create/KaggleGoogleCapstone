#include "agents/agent_bridge.hpp"
#include <httplib.h>
#include <iostream>
#include <algorithm>

namespace studymate {

AgentBridge::AgentBridge(std::shared_ptr<Database> db, const std::string& python_adk_url)
    : db_(db), python_adk_url_(python_adk_url) {}

json AgentBridge::post_to_adk(const std::string& endpoint, const json& payload, const std::string& agent_name) {
    db_->log_agent_trace({"", agent_name, "REQUEST", payload.dump(), "RUNNING"});

    std::string host = "localhost";
    int port = 5000;
    std::string clean_url = python_adk_url_;

    // Strip trailing slashes
    while (!clean_url.empty() && clean_url.back() == '/') {
        clean_url.pop_back();
    }

    if (clean_url.rfind("http://", 0) == 0) {
        clean_url = clean_url.substr(7);
    } else if (clean_url.rfind("https://", 0) == 0) {
        clean_url = clean_url.substr(8);
    }

    auto colon_pos = clean_url.find(':');
    if (colon_pos != std::string::npos) {
        host = clean_url.substr(0, colon_pos);
        try {
            port = std::stoi(clean_url.substr(colon_pos + 1));
        } catch (...) {
            port = 5000;
        }
    } else if (!clean_url.empty()) {
        host = clean_url;
    }

    httplib::Client cli(host, port);
    cli.set_connection_timeout(5);
    cli.set_read_timeout(15);

    auto res = cli.Post(endpoint.c_str(), payload.dump(), "application/json");

    if (res && res->status == 200) {
        try {
            json resp_json = json::parse(res->body);
            db_->log_agent_trace({"", agent_name, "RESPONSE", "Received response from ADK microservice", "SUCCESS"});
            return resp_json;
        } catch (const std::exception& e) {
            db_->log_agent_trace({"", agent_name, "ERROR", std::string("JSON Parse Exception: ") + e.what(), "FAILED"});
        }
    } else {
        std::string err_details = res ? "HTTP Error " + std::to_string(res->status) : "ADK service offline or unreachable";
        db_->log_agent_trace({"", agent_name, "WARNING", err_details + " (using robust fallback)", "FALLBACK"});
    }

    json fallback;
    fallback["status"] = "fallback";
    fallback["agent"] = agent_name;
    return fallback;
}

json AgentBridge::generate_plan(const std::string& goal, int total_days, int hours_per_day) {
    json req = {{"goal", goal}, {"total_days", total_days}, {"hours_per_day", hours_per_day}};
    return post_to_adk("/plan", req, "PlannerAgent");
}

json AgentBridge::explain_concept(const std::string& topic, const std::string& user_context) {
    json req = {{"topic", topic}, {"user_context", user_context}};
    return post_to_adk("/tutor", req, "TutorAgent");
}

json AgentBridge::generate_quiz(const std::string& topic, const std::string& difficulty) {
    json req = {{"topic", topic}, {"difficulty", difficulty}};
    return post_to_adk("/quiz", req, "QuizAgent");
}

json AgentBridge::research_resources(const std::string& topic) {
    json req = {{"topic", topic}};
    return post_to_adk("/research", req, "ResearchAgent");
}

json AgentBridge::adapt_plan(const std::string& plan_id, const std::string& quiz_topic, int score, int total) {
    json req = {{"plan_id", plan_id}, {"quiz_topic", quiz_topic}, {"score", score}, {"total", total}};
    return post_to_adk("/adapt", req, "ProgressAgent");
}

} // namespace studymate
