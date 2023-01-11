import dotenv from 'dotenv'

export const config = {
  secrets: {
    jwt: 'learneverything'
  },
  dbUrl: dotenv.config().parsed.DB_URL_DEV
}
