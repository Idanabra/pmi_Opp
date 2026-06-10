import { Router } from 'express'
import { postTask } from '../controllers/tasks.controller'

const router = Router()

router.post('/', postTask)

export default router
