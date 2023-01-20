import { Router } from 'express'
import { getUser, me, updateMe } from './user.controllers'

const router = Router()

// /api/user
router.get('/', me)
router.put('/', updateMe)

// /api/user/:nikname
router
  .route('/:nikname')
  .get(getUser)

export default router
