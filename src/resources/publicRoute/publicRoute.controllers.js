import { crudControllers } from "../../utils/crud";
import { PublicRoute } from "./publicRoute.model";
import { User } from "../user/user.model";
import { Route } from "../route/route.model";

export const createOne = async (data) => {
  const createdBy = data.user._id
  try {
    console.log('data', data);
    const doc = await PublicRoute.create({ ...data.body, createdBy })
    return doc
  } catch (e) {
    console.error(e)
    return { message: e.message }
  }
}

export const updateOne = async (data) => {
  try {
    const charmander = data.user.role === 'charmander'
    const search = charmander ?
      { _id: data.body.id } :
      { _id: data.body.id, createdBy: data.user._id }
    const updatedDoc = await PublicRoute
      .findOneAndUpdate(
        search,
        data.body,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return { message: 'Error updating ' }
    }

    return { data: updatedDoc }
  } catch (e) {
    console.error(e)
    return { message: e.message }
  }
}

export const removeOne = async (data) => {
  try {
    const charmander = data.user.role === 'charmander'
    const search = charmander ?
      { _id: data.body.id } :
      { _id: data.body.id, createdBy: data.user._id }
    const removed = await PublicRoute.findOneAndRemove(search).exec()

    if (!removed) {
      return { message: 'Error deleting' }
    }

    return { data: removed }
  } catch (e) {
    console.error(e)
    return { message: e.message }
  }
}

export const getOne = async (data) => {
  try {
    const doc = await PublicRoute.findOne({ _id: data.body.id }).lean().exec()
    if (!doc) {
      return { message: 'Error getting' }
    }

    const route = await Route.findOne({ _id: doc.route }).lean().exec()
    doc.route = route

    const user = await User.findOne({ _id: doc.createdBy }).lean().exec()
    doc.createdBy = user

    const passengers = await User.find({ _id: { $in: doc.passengers } }).lean().exec()
    doc.passengers = passengers


    return { data: doc }
  } catch (e) {
    console.error(e)
    return { message: e.message }
  }
}

export const getMany = async () => {
  try {
    const docs = await PublicRoute.find().lean().exec()
    if (!docs) {
      return { message: 'Error getting' }
    }

    const routes = await Route.find().lean().exec()
    const users = await User.find().lean().exec()

    docs.forEach(doc => {
      const route = routes.find(route => route._id.toString() === doc.route.toString())
      doc.route = route

      const user = users.find(user => user._id.toString() === doc.createdBy.toString())
      doc.createdBy = user

      const passengers = users.filter(user => doc.passengers.includes(user._id.toString()))
      doc.passengers = passengers
    })

    return { data: docs }
  } catch (e) {
    console.error(e)
    return { message: e.message }
  }
}

