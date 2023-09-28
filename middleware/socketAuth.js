const jwt = require("jsonwebtoken")
const jwksClient = require("jwks-rsa")

// Replace with your actual JWKS endpoint URL
const kid = process.env.JWT_KID
const jwksUri =
  "https://suited-donkey-2.clerk.accounts.dev/.well-known/jwks.json"

const socketAuth = (socket, next) => {
  const client = jwksClient({ jwksUri })

  client.getSigningKey(kid, (err, key) => {
    if (err) return next(err)

    const publicKey = key.publicKey || key.rsaPublicKey

    if (!socket.handshake.auth.token)
      return next(new Error("Authentication token missing"))

    const token = socket.handshake.auth.token.split(" ")[1]

    jwt.verify(token, publicKey, (err, decoded) => {
      if (err) return next(err)
    })
  })

  next()
}

module.exports = socketAuth
