import { Router } from "express";
import controllers, { getManyByUser, getManyRecurrentesByUser } from "./route.controllers";

const router = Router();

// /api/route
router
  .route("/")
  .get(getManyByUser)
  .post(controllers.createOne);

// /api/route/recurrente
router.route("/recurrente")
  .get(getManyRecurrentesByUser);


// /api/route/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;