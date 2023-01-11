import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Need email and password' })
  }
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.log(e)
    return res.status(400).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Need email and password' })
  }
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(401).send({ message: 'Not auth' })
  }

  try {
    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send({ message: 'Not auth' })
    }
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(401).send({ message: 'Not auth' })

  }
}

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end()
  }

  let token = req.headers.authorization.split('Bearer ')[1]

  if (!token) {
    return res.status(401).end()
  }
  try {
    const payload = await verifyToken(token)

    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    req.user = user
    next()
  } catch (e) {
    return res.status(401).end()
  }
}

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
    return res.status(401).send({ message: 'Not auth' })
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
    return res.status(401).send({ message: 'Not auth' })
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
    return res.status(400).end()
  }
}

export const resetPasswordByAdmin = async (req, res) => {
  if (!req.body.nikname) {
    return res.status(400).send({ message: 'Need nikname' })
  }
  const user = await User.findOne({ nikname: req.body.nikname })

  if (!user) {
    return res.status(401).send({ message: 'Not auth' })
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
    return res.status(401).send({ message: 'Not auth' })
  }
}

