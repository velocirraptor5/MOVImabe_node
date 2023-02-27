import { Router } from "express";
import controllers, { getManyByType, getManyByUser, getManyRecurrentesByUser } from "./route.controllers";

const router = Router();

// /api/route
router
  .route("/")
  .get(getManyByUser)
  .post(controllers.createOne);

// /api/route/recurrente
router.route("/recurrente")
  .get(getManyRecurrentesByUser);

router.route("/type/:type")
  .get(getManyByType);


// /api/route/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;