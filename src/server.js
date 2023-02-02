import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import feedbackRouter from './resources/feedBack/fbk.router'
import routeRouter from './resources/route/route.router'
import charmanderRouter from './resources/user/charmander/charmander.router'
import publicRouteRouter from './resources/publicRoute/publicRoute.router'
// import listRouter from './resources/list/list.router'
import { signin, signup, protect, verifyToken, newToken } from './utils/auth'
import { getMany } from './resources/user/user.controllers'
import { User } from './resources/user/user.model'

export const app = express()

import expressWs from 'express-ws'

const ws = expressWs(app)
app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signin', signin)
app.post('/signup', signup)
app.post('/verify', protect, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email })
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    res.status(401).end()
  }
})

app.use('/api', protect)  // <--- protect all routes below
app.use('/api/user', userRouter)
app.use('/api/feedBack', feedbackRouter)
app.use('/api/route', routeRouter)
app.use('/api/publicRoute', publicRouteRouter)
// app.use('/api/item', itemRouter)
// app.use('/api/list', listRouter)

// charmander are rhe admin routes
app.use('/api/charmander', charmanderRouter)  // <--- protect this route





export const start = async () => {
  try {
    await connect(
      config.dbUrl,
      {
        autoIndex: true,
        auth: {
          authSource: 'admin'
        },
      }
    )
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
