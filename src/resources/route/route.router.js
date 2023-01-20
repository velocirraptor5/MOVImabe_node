import { Router } from "express";
import controllers, { getManyByUser } from "./route.controllers";

const router = Router();

// /api/route
router
  .route("/")
  .get(getManyByUser)
  .post(controllers.createOne);

// /api/route/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;