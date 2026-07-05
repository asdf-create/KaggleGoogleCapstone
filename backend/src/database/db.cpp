#include "database/db.hpp"
#include <iostream>
#include <chrono>
#include <iomanip>
#include <sstream>

namespace studymate {

static std::string get_current_timestamp() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&in_time_t), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

Database::Database(const std::string& db_path) : db_path_(db_path) {}

Database::~Database() {
    if (db_) {
        sqlite3_close(db_);
        db_ = nullptr;
    }
}

bool Database::init() {
    int rc = sqlite3_open(db_path_.c_str(), &db_);
    if (rc != SQLITE_OK) {
        std::cerr << "[Database] Failed to open database: " << sqlite3_errmsg(db_) << std::endl;
        return false;
    }
    execute_schema();
    return true;
}

void Database::execute_schema() {
    const char* schema_sql = R"(
        CREATE TABLE IF NOT EXISTS study_plans (
            id TEXT PRIMARY KEY,
            goal TEXT NOT NULL,
            total_days INTEGER NOT NULL,
            hours_per_day INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            data_json TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS quizzes (
            id TEXT PRIMARY KEY,
            topic TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            data_json TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id TEXT NOT NULL,
            topic TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            timestamp TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS agent_traces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            agent_name TEXT NOT NULL,
            action TEXT NOT NULL,
            details TEXT NOT NULL,
            status TEXT NOT NULL
        );
    )";

    char* err_msg = nullptr;
    int rc = sqlite3_exec(db_, schema_sql, nullptr, nullptr, &err_msg);
    if (rc != SQLITE_OK) {
        std::cerr << "[Database] Schema initialization error: " << err_msg << std::endl;
        sqlite3_free(err_msg);
    }
}

bool Database::save_study_plan(const StudyPlan& plan) {
    std::string sql = "INSERT OR REPLACE INTO study_plans (id, goal, total_days, hours_per_day, created_at, data_json) VALUES (?, ?, ?, ?, ?, ?);";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) return false;

    json j = plan;
    std::string data_str = j.dump();

    sqlite3_bind_text(stmt, 1, plan.id.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, plan.goal.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, plan.total_days);
    sqlite3_bind_int(stmt, 4, plan.hours_per_day);
    sqlite3_bind_text(stmt, 5, plan.created_at.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 6, data_str.c_str(), -1, SQLITE_STATIC);

    bool success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}

std::vector<StudyPlan> Database::get_all_study_plans() {
    std::vector<StudyPlan> plans;
    const char* sql = "SELECT data_json FROM study_plans ORDER BY created_at DESC;";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            const char* json_str = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
            if (json_str) {
                try {
                    json j = json::parse(json_str);
                    StudyPlan plan = j.get<StudyPlan>();
                    plans.push_back(plan);
                } catch (...) {}
            }
        }
        sqlite3_finalize(stmt);
    }
    return plans;
}

std::unique_ptr<StudyPlan> Database::get_study_plan(const std::string& plan_id) {
    const char* sql = "SELECT data_json FROM study_plans WHERE id = ?;";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, plan_id.c_str(), -1, SQLITE_STATIC);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            const char* json_str = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
            if (json_str) {
                try {
                    json j = json::parse(json_str);
                    auto plan = std::make_unique<StudyPlan>(j.get<StudyPlan>());
                    sqlite3_finalize(stmt);
                    return plan;
                } catch (...) {}
            }
        }
        sqlite3_finalize(stmt);
    }
    return nullptr;
}

bool Database::save_quiz(const Quiz& quiz) {
    std::string sql = "INSERT OR REPLACE INTO quizzes (id, topic, difficulty, data_json) VALUES (?, ?, ?, ?);";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) return false;

    json j = quiz;
    std::string data_str = j.dump();

    sqlite3_bind_text(stmt, 1, quiz.id.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, quiz.topic.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, quiz.difficulty.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 4, data_str.c_str(), -1, SQLITE_STATIC);

    bool success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}

std::unique_ptr<Quiz> Database::get_quiz(const std::string& quiz_id) {
    const char* sql = "SELECT data_json FROM quizzes WHERE id = ?;";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, quiz_id.c_str(), -1, SQLITE_STATIC);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            const char* json_str = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
            if (json_str) {
                try {
                    json j = json::parse(json_str);
                    auto quiz = std::make_unique<Quiz>(j.get<Quiz>());
                    sqlite3_finalize(stmt);
                    return quiz;
                } catch (...) {}
            }
        }
        sqlite3_finalize(stmt);
    }
    return nullptr;
}

bool Database::save_quiz_result(const std::string& quiz_id, const std::string& topic, int score, int total) {
    std::string sql = "INSERT INTO quiz_results (quiz_id, topic, score, total, timestamp) VALUES (?, ?, ?, ?, ?);";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) return false;

    std::string ts = get_current_timestamp();
    sqlite3_bind_text(stmt, 1, quiz_id.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, topic.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, score);
    sqlite3_bind_int(stmt, 4, total);
    sqlite3_bind_text(stmt, 5, ts.c_str(), -1, SQLITE_STATIC);

    bool success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}

json Database::get_user_progress() {
    json progress_list = json::array();
    const char* sql = "SELECT topic, score, total, timestamp FROM quiz_results ORDER BY id DESC;";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            const char* topic = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
            int score = sqlite3_column_int(stmt, 1);
            int total = sqlite3_column_int(stmt, 2);
            const char* ts = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
            double percentage = total > 0 ? (double)score / total * 100.0 : 0.0;

            progress_list.push_back({
                {"topic", topic ? topic : ""},
                {"score", score},
                {"total", total},
                {"percentage", percentage},
                {"timestamp", ts ? ts : ""}
            });
        }
        sqlite3_finalize(stmt);
    }
    return progress_list;
}

void Database::log_agent_trace(const AgentTrace& trace) {
    std::string sql = "INSERT INTO agent_traces (timestamp, agent_name, action, details, status) VALUES (?, ?, ?, ?, ?);";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) return;

    std::string ts = trace.timestamp.empty() ? get_current_timestamp() : trace.timestamp;
    sqlite3_bind_text(stmt, 1, ts.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, trace.agent_name.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, trace.action.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 4, trace.details.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 5, trace.status.c_str(), -1, SQLITE_STATIC);

    sqlite3_step(stmt);
    sqlite3_finalize(stmt);
}

std::vector<AgentTrace> Database::get_agent_traces(int limit) {
    std::vector<AgentTrace> traces;
    std::string sql = "SELECT timestamp, agent_name, action, details, status FROM agent_traces ORDER BY id DESC LIMIT ?;";
    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db_, sql.c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, limit);
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            AgentTrace t;
            const char* ts = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
            const char* name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
            const char* act = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2));
            const char* det = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
            const char* st = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 4));

            t.timestamp = ts ? ts : "";
            t.agent_name = name ? name : "";
            t.action = act ? act : "";
            t.details = det ? det : "";
            t.status = st ? st : "";
            traces.push_back(t);
        }
        sqlite3_finalize(stmt);
    }
    return traces;
}

} // namespace studymate
