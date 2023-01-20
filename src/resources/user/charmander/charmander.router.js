import { Router } from 'express'
import {
  checkCharmander,
  deleteUser,
  getManyFeedback,
  getManyRoute,
  getManyUser,
  resetPasswordByAdmin
} from './charmander.controllers'

const router = Router()

// /api/charmender
router.use('/', checkCharmander)  // <--- protect all routes below
router.post('/reset-user-password', resetPasswordByAdmin)
router.delete('/delete-user', deleteUser)
router.get('/users', getManyUser)
router.get('/routes', getManyRoute)

// for feedback

export default router