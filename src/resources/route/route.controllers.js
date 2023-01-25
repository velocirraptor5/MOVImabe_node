import { crudControllers } from "../../utils/crud";
import { Route } from "./route.model";

export default crudControllers(Route);

// get all routes created by user
export const getManyByUser = async (req, res) => {
  try {
    const docs = await Route
      .find({ createdBy: req.user._id })
      .lean()
      .exec()

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
};

// get all recurrent routes created by user
export const getManyRecurrentesByUser = async (req, res) => {
  try {
    const docs = await Route
      .find({ createdBy: req.user._id, recurrente: true })
      .lean()
      .exec()

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}