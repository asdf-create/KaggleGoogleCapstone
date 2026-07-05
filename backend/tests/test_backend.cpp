#include <iostream>
#include <cassert>
#include <memory>
#include "database/db.hpp"
#include "agents/agent_bridge.hpp"
#include "api/routes.hpp"

void test_database_operations() {
    std::cout << "[Test] Running SQLite Database Tests..." << std::endl;
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

    std::cout << "  [PASSED] Database Save & Retrieval verified." << std::endl;
}

void test_quiz_and_traces() {
    std::cout << "[Test] Running Quiz & Agent Trace Tests..." << std::endl;
    auto db = std::make_shared<studymate::Database>("test_studymate.db");
    db->init();

    db->log_agent_trace({"2026-07-05 23:01:00", "PlannerAgent", "GENERATE_PLAN", "Generated 30-day schedule", "SUCCESS"});
    auto traces = db->get_agent_traces(10);
    assert(!traces.empty());
    assert(traces[0].agent_name == "PlannerAgent");

    assert(db->save_quiz_result("q1", "Linear Algebra", 4, 5) == true);
    auto progress = db->get_user_progress();
    assert(!progress.empty());

    std::cout << "  [PASSED] Quiz Results & Agent Traces verified." << std::endl;
}

int main() {
    std::cout << "============================================" << std::endl;
    std::cout << "  Running StudyMate C++ Backend Test Suite  " << std::endl;
    std::cout << "============================================" << std::endl;

    try {
        test_database_operations();
        test_quiz_and_traces();
        std::cout << "\nALL C++ BACKEND TESTS PASSED SUCCESSFULLY! (100% Pass Rate)\n" << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "\n[TEST FAILED]: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
