const userRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const post = require('./user_function_post');

function setupRoutes(app) {
  // Register all routes
  app.use("/user", userRoutes);
  app.use("/email", emailRoutes);
  app.use('/', post);
}

module.exports = setupRoutes;