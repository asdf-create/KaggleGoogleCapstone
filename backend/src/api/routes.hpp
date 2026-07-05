#ifndef STUDYMATE_ROUTES_HPP
#define STUDYMATE_ROUTES_HPP

#include <httplib.h>
#include <memory>
#include "database/db.hpp"
#include "agents/agent_bridge.hpp"

namespace studymate {

class Routes {
public:
    Routes(std::shared_ptr<Database> db, std::shared_ptr<AgentBridge> bridge);
    void setup_routes(httplib::Server& svr);

private:
    std::shared_ptr<Database> db_;
    std::shared_ptr<AgentBridge> bridge_;

    void enable_cors(const httplib::Request& req, httplib::Response& res);
};

} // namespace studymate

#endif // STUDYMATE_ROUTES_HPP
