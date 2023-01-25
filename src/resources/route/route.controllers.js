import { crudControllers } from "../../utils/crud";
import { Route } from "./route.model";

export default crudControllers(Route);

// get all routes created by user
export const getManyByUser = async (req, res) => {
  const recurrente = req.body.recurrente ? req.body.recurrente : false;
  try {
    const docs = await Route
      .find({ createdBy: req.user._id, recurrente: recurrente })
      .lean()
      .exec()

    res.status(200).json({ data: docs })

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
};