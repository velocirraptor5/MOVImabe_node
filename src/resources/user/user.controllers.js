import { crudControllers } from '../../utils/crud'
import { User } from './user.model'

export default crudControllers(User)

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  if (req.nikname) {
    // if user try to change nikname check if nikname is free
    const user = await User.findOne({ nikname: req.nikname })
      .lean()
      .exec()

    if (user) {
      return res.status(400).send({ message: 'Nikname is busy' })
    }
  }
  // cannot change role unless you are charmander
  if (req.role && req.user.role !== 'charmander') {
    return res.status(400).send({ message: 'You are not charmander' })
  }
  // cannot change password
  if (req.password) {
    return res.status(400).send({ message: 'to change password use module, change password' })
  }
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// get user by nikname
export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ nikname: req.params.nikname })
      .lean()
      .exec()

    if (!user) {
      return res.status(400).end()
    }

    // remove password and settings from user
    user.password = undefined
    user.settings = undefined

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// get users feedBacks
export const getUserFeedBacks = async (req, res) => {
  try {
    const user = await User.findOne({ nikname: req.params.nikname })
      .lean()
      .exec()

    if (!user) {
      return res.status(400).end()
    }

    res.status(200).json({ data: user.feedBacks })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
