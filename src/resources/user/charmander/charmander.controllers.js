import { newToken } from '../../../utils/auth'
import { crudControllers } from '../../../utils/crud'
import { FeedBack } from '../../feedBack/fbk.model'
import { Route } from '../../route/route.model'
import { User } from "../user.model"


// check user charmander role
export const checkCharmander = async (req, res, next) => {
  if (!req.user.role === 'charmander') {
    return res.status(401).end()
  }
  next()
}

// reset user password
export const resetPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: 'Need email' })
  }
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(401).send({ message: 'No user found with nikname' + req.body.email })
  }
  // verify password in req.body
  if (!req.body.password) {
    return res.status(401).send({ message: 'Need new password' })
  }

  try {
    // update user password
    user.password = req.body.password
    await user.save()
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(401).send({ message: e.message })
  }
}

// delete user account by nikname
export const deleteUser = async (req, res) => {
  if (!req.body.nikname) {
    return res.status(400).send({ message: 'Need nikname' })
  }
  try {
    const user = await User.findOne({ nikname: req.body.nikname })
      .lean()
      .exec()

    if (!user) {
      return res.status(400).send({ message: 'User not found' })
    }

    await User.deleteOne({ nikname: req.body.nikname })
    return res.status(200).send({ message: 'User deleted' })
  } catch (e) {
    console.error(e)
    return res.status(400).send({ message: e.message })
  }
}


export const resetPasswordByAdmin = async (req, res) => {
  if (!req.body.nikname) {
    return res.status(400).send({ message: 'Need nikname' })
  }
  const user = await User.findOne({ nikname: req.body.nikname })

  if (!user) {
    return res.status(401).send({ message: ' No user with nikname ' + req.body.nikname })
  }
  // verify password in req.body
  if (!req.body.newPassword) {
    return res.status(401).send({ message: 'Need new password' })
  }

  try {
    // update user password
    user.password = req.body.newPassword
    await user.save()
    const token = newToken(user)
    return res.status(201).send({ token })
  }
  catch (e) {
    console.error(e)
    return res.status(401).send({ message: e.message })
  }
}

// get all users, just for admin
export const getManyUser = async (req, res) => {
  const users = await crudControllers(User).getMany(req, res)
}

// get all route, just for admin
export const getManyRoute = async (req, res) => {
  const routes = await crudControllers(Route).getMany(req, res)
}


