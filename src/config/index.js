import { merge } from 'lodash'
import dotenv from 'dotenv'

const env = process.env.NODE_ENV || 'development'

const PORT = process.env.PORT || dotenv.config().parsed.PORT || 95

const JWT_SECRET = process.env.JWT_SECRET || dotenv.config().parsed.JWT_SECRET || 'learneverything'

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: PORT,
  secrets: {
    jwt: JWT_SECRET,
    jwtExp: '100d'
  }
}

let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config
    break
  case 'test':
  case 'testing':
    envConfig = require('./testing').config
    break
  default:
    envConfig = require('./dev').config
}

export default merge(baseConfig, envConfig)
