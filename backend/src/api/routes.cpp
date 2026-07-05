#include "api/routes.hpp"
#include <iostream>
#include <random>
#include <sstream>

namespace studymate {

static std::string generate_uuid() {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    static std::uniform_int_distribution<> dis(0, 15);
    const char* v = "0123456789abcdef";
    std::stringstream ss;
    for (int i = 0; i < 16; i++) {
        ss << v[dis(gen)];
    }
    return ss.str();
}

Routes::Routes(std::shared_ptr<Database> db, std::shared_ptr<AgentBridge> bridge)
    : db_(db), bridge_(bridge) {}

void Routes::enable_cors(const httplib::Request&, httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

void Routes::setup_routes(httplib::Server& svr) {
    // OPTIONS handler for CORS preflight
    svr.Options(R"(.*)", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        res.status = 200;
    });

    // Health check
    svr.Get("/api/health", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        json j = {{"status", "ok"}, {"service", "StudyMate C++ REST API"}, {"version", "1.0.0"}};
        res.set_content(j.dump(), "application/json");
    });

    // POST /api/goals -> Create study roadmap
    svr.Post("/api/goals", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        try {
            json body = json::parse(req.body);
            std::string goal = body.value("goal", "Learn Machine Learning");
            int total_days = body.value("total_days", 30);
            int hours_per_day = body.value("hours_per_day", 2);

            json plan_json = bridge_->generate_plan(goal, total_days, hours_per_day);

            StudyPlan plan;
            plan.id = generate_uuid();
            plan.goal = goal;
            plan.total_days = total_days;
            plan.hours_per_day = hours_per_day;
            plan.created_at = "2026-07-05 23:00:00";

            if (plan_json.contains("schedule")) {
                plan.schedule = plan_json["schedule"].get<std::vector<StudyDay>>();
            } else {
                // Default fallback schedule if ADK service offline
                StudyDay day1;
                day1.day_number = 1;
                day1.title = "Introduction & Core Foundations";
                day1.tasks = {
                    {"t1", "Overview of " + goal, "Study foundational concepts", 60, false},
                    {"t2", "Key Terminology & Tools", "Set up environment and read overview", 60, false}
                };
                plan.schedule.push_back(day1);
            }

            db_->save_study_plan(plan);

            json response = plan;
            res.set_content(response.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            json err = {{"error", e.what()}};
            res.set_content(err.dump(), "application/json");
        }
    });

    // GET /api/plans -> Fetch all plans
    svr.Get("/api/plans", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        auto plans = db_->get_all_study_plans();
        json j = plans;
        res.set_content(j.dump(), "application/json");
    });

    // GET /api/plans/:id -> Fetch specific plan
    svr.Get(R"(/api/plans/([a-zA-Z0-9_\-]+))", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        std::string plan_id = req.matches[1];
        auto plan = db_->get_study_plan(plan_id);
        if (plan) {
            json j = *plan;
            res.set_content(j.dump(), "application/json");
        } else {
            res.status = 404;
            res.set_content(R"({"error": "Plan not found"})", "application/json");
        }
    });

    // POST /api/tutor/explain -> Personalized explanation
    svr.Post("/api/tutor/explain", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        try {
            json body = json::parse(req.body);
            std::string topic = body.value("topic", "General Topic");
            std::string user_context = body.value("user_context", "Beginner");

            json tutor_res = bridge_->explain_concept(topic, user_context);
            res.set_content(tutor_res.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(R"({"error": "Invalid request"})", "application/json");
        }
    });

    // POST /api/quiz/generate -> Generate adaptive quiz
    svr.Post("/api/quiz/generate", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        try {
            json body = json::parse(req.body);
            std::string topic = body.value("topic", "Machine Learning");
            std::string difficulty = body.value("difficulty", "medium");

            json quiz_res = bridge_->generate_quiz(topic, difficulty);

            Quiz quiz;
            quiz.id = generate_uuid();
            quiz.topic = topic;
            quiz.difficulty = difficulty;

            if (quiz_res.contains("questions")) {
                quiz.questions = quiz_res["questions"].get<std::vector<Question>>();
            } else {
                Question q1;
                q1.id = "q1";
                q1.question_text = "What is the primary objective of gradient descent in machine learning?";
                q1.options = {"To maximize loss", "To minimize cost function", "To generate random weights", "To compress data"};
                q1.correct_option_index = 1;
                q1.explanation = "Gradient descent iteratively adjusts parameters to find the minimum of the cost function.";
                quiz.questions.push_back(q1);
            }

            db_->save_quiz(quiz);
            json resp = quiz;
            res.set_content(resp.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(R"({"error": "Invalid request"})", "application/json");
        }
    });

    // POST /api/quiz/submit -> Submit quiz answers and update score
    svr.Post("/api/quiz/submit", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        try {
            json body = json::parse(req.body);
            std::string quiz_id = body.value("quiz_id", "q1");
            std::string topic = body.value("topic", "General");
            int score = body.value("score", 0);
            int total = body.value("total", 1);
            std::string plan_id = body.value("plan_id", "");

            db_->save_quiz_result(quiz_id, topic, score, total);

            json adapted_plan = json::object();
            if (!plan_id.empty()) {
                adapted_plan = bridge_->adapt_plan(plan_id, topic, score, total);
            }

            json response = {
                {"status", "submitted"},
                {"quiz_id", quiz_id},
                {"score", score},
                {"total", total},
                {"percentage", total > 0 ? (double)score / total * 100.0 : 0.0},
                {"adapted_plan", adapted_plan}
            };
            res.set_content(response.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(R"({"error": "Invalid submission"})", "application/json");
        }
    });

    // POST /api/research -> Search resources & YouTube videos with transcripts
    svr.Post("/api/research", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        try {
            json body = json::parse(req.body);
            std::string topic = body.value("topic", "Machine Learning");

            json research_res = bridge_->research_resources(topic);
            res.set_content(research_res.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(R"({"error": "Invalid research request"})", "application/json");
        }
    });

    // GET /api/analytics -> Get overall analytics
    svr.Get("/api/analytics", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        json progress = db_->get_user_progress();
        json response = {
            {"quiz_history", progress},
            {"total_quizzes_taken", progress.size()}
        };
        res.set_content(response.dump(), "application/json");
    });

    // GET /api/antigravity/traces -> Antigravity agent traces
    svr.Get("/api/antigravity/traces", [this](const httplib::Request& req, httplib::Response& res) {
        enable_cors(req, res);
        auto traces = db_->get_agent_traces(50);
        json j = traces;
        res.set_content(j.dump(), "application/json");
    });
}

} // namespace studymate
