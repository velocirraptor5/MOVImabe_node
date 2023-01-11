import { Router } from 'express'
import controllers from './fbk.controllers'

const router = Router()

// /api/feedBack
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/feeback/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
