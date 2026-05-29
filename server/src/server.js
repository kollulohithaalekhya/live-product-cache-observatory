require("dotenv").config();

const app = require("./app");

const {
  connectRedis,
} = require("./cache/redisClient");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectRedis();

    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup error:",
      error
    );
  }
};

startServer();