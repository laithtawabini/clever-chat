const logger = {
  message: (...params) => {
    if(process.env.NODE_ENV === 'production')
      return

    console.log(...params)
  },

  error: (...params) => {
    if(process.env.NODE_ENV === 'production')
      return
    
    console.log(...params)
  },
}

module.exports = logger
