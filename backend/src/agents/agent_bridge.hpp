#ifndef STUDYMATE_AGENT_BRIDGE_HPP
#define STUDYMATE_AGENT_BRIDGE_HPP

#include <string>
#include <memory>
#include <nlohmann/json.hpp>
#include "database/db.hpp"

using json = nlohmann::json;

namespace studymate {

class AgentBridge {
public:
    AgentBridge(std::shared_ptr<Database> db, const std::string& python_adk_url = "http://localhost:5000");

    json generate_plan(const std::string& goal, int total_days, int hours_per_day);
    json explain_concept(const std::string& topic, const std::string& user_context);
    json generate_quiz(const std::string& topic, const std::string& difficulty);
    json research_resources(const std::string& topic);
    json adapt_plan(const std::string& plan_id, const std::string& quiz_topic, int score, int total);

private:
    std::shared_ptr<Database> db_;
    std::string python_adk_url_;

    json post_to_adk(const std::string& endpoint, const json& payload, const std::string& agent_name);
};

} // namespace studymate

#endif // STUDYMATE_AGENT_BRIDGE_HPP
