export const getOne = model => async (req, res) => {
  try {
    const doc = await model
      .findOne({ _id: req.params.id })
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getMany = model => async (req, res) => {
  try {
    const docs = await model
      .find()
      .lean()
      .exec()

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createOne = model => async (req, res) => {
  const createdBy = req.user._id
  try {
    const doc = await model.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateOne = model => async (req, res) => {
  try {
    const charmander = req.user.role === 'charmander'
    const search = charmander ?
      { _id: req.params.id } :
      { _id: req.params.id, createdBy: req.user._id }
    const updatedDoc = await model
      .findOneAndUpdate(
        search,
        req.body,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).send({ message: 'Error updating ' })
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).send({ message: e.message })
  }
}

export const removeOne = model => async (req, res) => {
  try {
    const charmander = req.user.role === 'charmander'
    const search = charmander ?
      { _id: req.params.id } :
      { _id: req.params.id, createdBy: req.user._id }
    const removed = await model.findOneAndRemove(search).exec()

    if (!removed) {
      return res.status(400).send({ message: 'Error deleting' })
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(400).send({ message: e.message })
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
