#include "agents/agent_bridge.hpp"
#include <httplib.h>
#include <iostream>

namespace studymate {

AgentBridge::AgentBridge(std::shared_ptr<Database> db, const std::string& python_adk_url)
    : db_(db), python_adk_url_(python_adk_url) {}

json AgentBridge::post_to_adk(const std::string& endpoint, const json& payload, const std::string& agent_name) {
    db_->log_agent_trace({"", agent_name, "REQUEST", payload.dump(), "RUNNING"});

    // Extract host and port
    std::string host = "localhost";
    int port = 5000;
    if (python_adk_url_.find("http://") == 0) {
        std::string url_no_scheme = python_adk_url_.substr(7);
        auto colon_pos = url_no_scheme.find(':');
        if (colon_pos != std::string::npos) {
            host = url_no_scheme.substr(0, colon_pos);
            port = std::stoi(url_no_scheme.substr(colon_pos + 1));
        } else {
            host = url_no_scheme;
        }
    }

    httplib::Client cli(host, port);
    cli.set_connection_timeout(10);
    cli.set_read_timeout(30);

    auto res = cli.Post(endpoint.c_str(), payload.dump(), "application/json");

    if (res && res->status == 200) {
        try {
            json resp_json = json::parse(res->body);
            db_->log_agent_trace({"", agent_name, "RESPONSE", "Received successful response from ADK service", "SUCCESS"});
            return resp_json;
        } catch (const std::exception& e) {
            db_->log_agent_trace({"", agent_name, "ERROR", e.what(), "FAILED"});
        }
    } else {
        std::string err_details = res ? "HTTP Error " + std::to_string(res->status) : "Connection to ADK service failed";
        db_->log_agent_trace({"", agent_name, "ERROR", err_details, "FAILED"});
    }

    // Fallback response if microservice is offline during standalone tests
    json fallback;
    fallback["status"] = "mock_fallback";
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
