import * as dotenv from 'dotenv'

// Carga las variables de entorno del .env en process.env
dotenv.config()

export default {
  PORT: process.env.PORT || 4500,
  DB_URI: process.env.DB_URI,
  TOKEN_SECRET: process.env.TOKEN_SECRET
} 