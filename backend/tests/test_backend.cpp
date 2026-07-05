#include <iostream>
#include <cassert>
#include <memory>
#include <cstdio>
#include "database/db.hpp"
#include "agents/agent_bridge.hpp"
#include "models/models.hpp"

static const char* TEST_DB_PATH = "test_studymate.db";

void test_database_operations() {
    std::cout << "[Test 1/5] Running SQLite Database Plan Tests..." << std::endl;
    auto db = std::make_shared<studymate::Database>("test_studymate.db");
    assert(db->init() == true);

    studymate::StudyPlan plan;
    plan.id = "test-plan-123";
    plan.goal = "Master Machine Learning";
    plan.total_days = 30;
    plan.hours_per_day = 2;
    plan.created_at = "2026-07-05 23:00:00";

    studymate::StudyDay day1;
    day1.day_number = 1;
    day1.title = "Linear Algebra Review";
    day1.tasks = {{"t1", "Vectors & Matrices", "Watch video and solve practice", 60, false}};
    plan.schedule.push_back(day1);

    assert(db->save_study_plan(plan) == true);

    auto retrieved = db->get_study_plan("test-plan-123");
    assert(retrieved != nullptr);
    assert(retrieved->goal == "Master Machine Learning");
    assert(retrieved->total_days == 30);
    assert(retrieved->schedule.size() == 1);

    auto non_existent = db->get_study_plan("non-existent-id");
    assert(non_existent == nullptr);

    std::cout << "  [PASSED] Database Plan Save & Retrieval verified." << std::endl;
}

void test_quiz_and_results() {
    std::cout << "[Test 2/5] Running Quiz & Result Database Tests..." << std::endl;
    auto db = std::make_shared<studymate::Database>("test_studymate.db");
    db->init();

    studymate::Quiz quiz;
    quiz.id = "q_test_01";
    quiz.topic = "Probability & Statistics";
    quiz.difficulty = "medium";
    studymate::Question q1;
    q1.id = "q1";
    q1.question_text = "What is Bayes Theorem?";
    q1.options = {"A", "B", "C", "D"};
    q1.correct_option_index = 0;
    q1.explanation = "Bayes theorem describes conditional probability.";
    quiz.questions.push_back(q1);

    assert(db->save_quiz(quiz) == true);

    auto retrieved_quiz = db->get_quiz("q_test_01");
    assert(retrieved_quiz != nullptr);
    assert(retrieved_quiz->topic == "Probability & Statistics");
    assert(retrieved_quiz->questions.size() == 1);

    assert(db->save_quiz_result("q_test_01", "Probability & Statistics", 4, 5) == true);
    auto progress = db->get_user_progress();
    assert(!progress.empty());
    assert(progress[0]["topic"] == "Probability & Statistics");
    assert(progress[0]["score"] == 4);

    std::cout << "  [PASSED] Quiz & Result database operations verified." << std::endl;
}

void test_agent_traces_and_limits() {
    std::cout << "[Test 3/5] Running Antigravity Agent Trace Tests..." << std::endl;
    auto db = std::make_shared<studymate::Database>("test_studymate.db");
    db->init();

    for (int i = 0; i < 15; ++i) {
        db->log_agent_trace({"2026-07-05 23:01:00", "PlannerAgent", "TEST_ACTION_" + std::to_string(i), "Details", "SUCCESS"});
    }

    auto traces = db->get_agent_traces(10);
    assert(traces.size() == 10);
    assert(traces[0].agent_name == "PlannerAgent");

    std::cout << "  [PASSED] Antigravity Trace logging & limit filtering verified." << std::endl;
}

void test_models_json_serialization() {
    std::cout << "[Test 4/5] Running JSON Model Serialization Tests..." << std::endl;

    studymate::YouTubeVideo vid{"Intro to ML", "v123", "https://youtube.com/v123", "StatQuest", "12:34"};
    json j_vid = vid;
    assert(j_vid["video_id"] == "v123");
    studymate::YouTubeVideo vid2 = j_vid.get<studymate::YouTubeVideo>();
    assert(vid2.title == "Intro to ML");

    studymate::TranscriptItem item{45.0, "00:45", "Concept explanation"};
    json j_item = item;
    assert(j_item["time_formatted"] == "00:45");
    studymate::TranscriptItem item2 = j_item.get<studymate::TranscriptItem>();
    assert(item2.timestamp_seconds == 45.0);

    std::cout << "  [PASSED] Model JSON serialization verified." << std::endl;
}

void test_agent_bridge_fallbacks() {
    std::cout << "[Test 5/5] Running AgentBridge Offline Fallback Tests..." << std::endl;
    auto db = std::make_shared<studymate::Database>("test_studymate.db");
    db->init();

    studymate::AgentBridge bridge(db, "http://localhost:59999"); // Offline port

    json plan_res = bridge.generate_plan("Learn C++", 10, 2);
    assert(plan_res["status"] == "fallback");

    json tutor_res = bridge.explain_concept("Pointers", "Beginner");
    assert(tutor_res["status"] == "fallback");

    json quiz_res = bridge.generate_quiz("Pointers", "easy");
    assert(quiz_res["status"] == "fallback");

    json research_res = bridge.research_resources("C++ Templates");
    assert(research_res["status"] == "fallback");

    std::cout << "  [PASSED] AgentBridge fallbacks verified." << std::endl;
}

int main() {
    std::cout << "============================================" << std::endl;
    std::cout << "  Running StudyMate C++ Backend Test Suite  " << std::endl;
    std::cout << "============================================" << std::endl;

    try {
        test_database_operations();
        test_quiz_and_results();
        test_agent_traces_and_limits();
        test_models_json_serialization();
        test_agent_bridge_fallbacks();

        // Clean up test database file to prevent test pollution
        std::remove(TEST_DB_PATH);

        std::cout << "\nALL C++ BACKEND TESTS PASSED SUCCESSFULLY! (100% Pass Rate)\n" << std::endl;
    } catch (const std::exception& e) {
        std::remove(TEST_DB_PATH);
        std::cerr << "\n[TEST FAILED]: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
