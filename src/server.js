import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import feedbackRouter from './resources/feedBack/fbk.router'
// import itemRouter from './resources/item/item.router'
// import listRouter from './resources/list/list.router'
import { signin, signup, protect, checkCharmander, deleteUser, resetPasswordByAdmin } from './utils/auth'  // <--- import auth functions

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signin', signin)
app.post('/signup', signup)

app.use('/api', protect)  // <--- protect all routes below
app.use('/api/user', userRouter)
app.use('/api/feedBack', feedbackRouter)
// app.use('/api/item', itemRouter)
// app.use('/api/list', listRouter)

// charmander api
app.use('/api/charmander', checkCharmander)  // <--- protect this route
app.post('/api/charmander/reset-user-password', resetPasswordByAdmin)
app.delete('/api/charmander/delete-user', deleteUser)


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
