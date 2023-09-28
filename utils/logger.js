const logger = {
  message: (...params) => {
    console.log(...params)
  },

  error: (...params) => {
    console.log(...params)
  },
}

module.exports = logger
