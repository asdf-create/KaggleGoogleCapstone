cmake_minimum_required(VERSION 3.20)
project(studymate_backend CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

# Fetch cpp-httplib (Header-only HTTP REST server)
FetchContent_Declare(
    httplib
    GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
    GIT_TAG v0.14.1
)
FetchContent_MakeAvailable(httplib)

# Fetch nlohmann_json (Header-only JSON library)
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.3
)
FetchContent_MakeAvailable(json)

# Find SQLite3
find_package(SQLite3 REQUIRED)

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${SQLite3_INCLUDE_DIRS}
)

# Source files
set(SOURCES
    src/database/db.cpp
    src/agents/agent_bridge.cpp
    src/api/routes.cpp
)

# Main Executable
add_executable(studymate_server src/main.cpp ${SOURCES})
target_link_libraries(studymate_server PRIVATE httplib::httplib nlohmann_json::nlohmann_json SQLite::SQLite3)

# Backend Test Executable
add_executable(studymate_tests tests/test_backend.cpp ${SOURCES})
target_link_libraries(studymate_tests PRIVATE httplib::httplib nlohmann_json::nlohmann_json SQLite::SQLite3)
