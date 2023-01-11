import { Router } from 'express'
import { getUser, getUserFeedBacks, me, updateMe } from './user.controllers'

const router = Router()

// /api/user
router.get('/', me)
router.put('/', updateMe)

// /api/user/:nikname
router
  .route('/:nikname')
  .get(getUser)

// get users feedBacks
router
  .route('/:nikname/feedBacks')
  .get(getUserFeedBacks)

export default router
