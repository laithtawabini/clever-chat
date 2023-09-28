const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  // Handle the error or log it
  logger.error(err.stack)

  // Determine the response status code based on the error
  const statusCode = err.statusCode || 500 // Default to 500 (Internal Server Error)

  // Send an error response to the client
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  })
}

module.exports = errorHandler
