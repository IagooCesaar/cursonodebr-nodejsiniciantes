const BaseRoutes = require("./base/baseRoute");
const { join } = require("path");

class UtilRoutes extends BaseRoutes {
  coverage() {
    return {
      path: "/coverage/{params*}",
      method: "GET",
      config: {
        auth: false,
      },
      handler: {
        directory: {
          path: join(__dirname, "..", "..", "coverage"),
          redirectToSlash: true,
          index: true,
        },
      },
    };
  }
}

module.exports = UtilRoutes;
