require("dotenv").config()

module.exports = {
  api: {
    port: process.env.API_PORT || "3000",
    corsAllowOrigin: process.env.CORS_ALLOW_ORIGIN || "*",
    corsAllowHeaders: process.env.CORS_ALLOW_HEADER || "*"
  },
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS || 10
  },
  db: {
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || "5432",
    database: process.env.DB_DATABASE || "rxminder"
  }
}