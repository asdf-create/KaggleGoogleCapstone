#ifndef STUDYMATE_MODELS_HPP
#define STUDYMATE_MODELS_HPP

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

namespace studymate {

struct Task {
    std::string id;
    std::string topic;
    std::string description;
    int duration_minutes;
    bool completed;

    NLOHMANN_DEFINE_TYPE_INTRUSIVE(Task, id, topic, description, duration_minutes, completed)
};

struct StudyDay {
    int day_number;
    std::string title;
    std::vector<Task> tasks;

    NLOHMANN_DEFINE_TYPE_INTRUSIVE(StudyDay, day_number, title, tasks)
};

struct StudyPlan {
    std::string id;
    std::string goal;
    int total_days;
    int hours_per_day;
    std::string created_at;
    std::vector<StudyDay> schedule;

    NLOHMANN_DEFINE_TYPE_INTRUSIVE(StudyPlan, id, goal, total_days, hours_per_day, created_at, schedule)
};

struct YouTubeVideo {
    std::string title;
    std::string video_id;
    std::string url;
    std::string channel;
    std::string duration;
};

struct TranscriptItem {
    double timestamp_seconds;
    std::string time_formatted;
    std::string text;
};

inline void to_json(json& j, const YouTubeVideo& v) {
    j = json{{"title", v.title}, {"video_id", v.video_id}, {"url", v.url}, {"channel", v.channel}, {"duration", v.duration}};
}

inline void from_json(const json& j, YouTubeVideo& v) {
    j.at("title").get_to(v.title);
    j.at("video_id").get_to(v.video_id);
    j.at("url").get_to(v.url);
    j.at("channel").get_to(v.channel);
    j.at("duration").get_to(v.duration);
}

inline void to_json(json& j, const TranscriptItem& t) {
    j = json{{"timestamp_seconds", t.timestamp_seconds}, {"time_formatted", t.time_formatted}, {"text", t.text}};
}

inline void from_json(const json& j, TranscriptItem& t) {
    j.at("timestamp_seconds").get_to(t.timestamp_seconds);
    j.at("time_formatted").get_to(t.time_formatted);
    j.at("text").get_to(t.text);
}

struct ResourceItem {
    std::string title;
    std::string url;
    std::string type; // "video", "paper", "doc", "repo"
    std::string snippet;
    double relevance_score;
    std::vector<YouTubeVideo> youtube_videos;
    std::vector<TranscriptItem> transcript;
};

inline void to_json(json& j, const ResourceItem& r) {
    j = json{
        {"title", r.title},
        {"url", r.url},
        {"type", r.type},
        {"snippet", r.snippet},
        {"relevance_score", r.relevance_score},
        {"youtube_videos", r.youtube_videos},
        {"transcript", r.transcript}
    };
}

inline void from_json(const json& j, ResourceItem& r) {
    j.at("title").get_to(r.title);
    j.at("url").get_to(r.url);
    j.at("type").get_to(r.type);
    j.at("snippet").get_to(r.snippet);
    j.at("relevance_score").get_to(r.relevance_score);
    if (j.contains("youtube_videos")) j.at("youtube_videos").get_to(r.youtube_videos);
    if (j.contains("transcript")) j.at("transcript").get_to(r.transcript);
}

struct Question {
    std::string id;
    std::string question_text;
    std::vector<std::string> options;
    int correct_option_index;
    std::string explanation;

    NLOHMANN_DEFINE_TYPE_INTRUSIVE(Question, id, question_text, options, correct_option_index, explanation)
};

struct Quiz {
    std::string id;
    std::string topic;
    std::string difficulty;
    std::vector<Question> questions;

    NLOHMANN_DEFINE_TYPE_INTRUSIVE(Quiz, id, topic, difficulty, questions)
};

struct AgentTrace {
    std::string timestamp;
    std::string agent_name;
    std::string action;
    std::string details;
    std::string status;

    NLOHMANN_DEFINE_TYPE_INTRUSIVE(AgentTrace, timestamp, agent_name, action, details, status)
};

} // namespace studymate

#endif // STUDYMATE_MODELS_HPP
