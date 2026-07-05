#ifndef STUDYMATE_DB_HPP
#define STUDYMATE_DB_HPP

#include <string>
#include <vector>
#include <memory>
#include <sqlite3.h>
#include "models/models.hpp"

namespace studymate {

class Database {
public:
    explicit Database(const std::string& db_path = "studymate.db");
    ~Database();

    bool init();
    
    // Study Plan Management
    bool save_study_plan(const StudyPlan& plan);
    std::vector<StudyPlan> get_all_study_plans();
    std::unique_ptr<StudyPlan> get_study_plan(const std::string& plan_id);

    // Quizzes & Attempts
    bool save_quiz(const Quiz& quiz);
    std::unique_ptr<Quiz> get_quiz(const std::string& quiz_id);
    bool save_quiz_result(const std::string& quiz_id, const std::string& topic, int score, int total);

    // Analytics & Progress
    json get_user_progress();

    // Agent Traces (Antigravity logs)
    void log_agent_trace(const AgentTrace& trace);
    std::vector<AgentTrace> get_agent_traces(int limit = 50);

private:
    std::string db_path_;
    sqlite3* db_{nullptr};

    void execute_schema();
};

} // namespace studymate

#endif // STUDYMATE_DB_HPP
