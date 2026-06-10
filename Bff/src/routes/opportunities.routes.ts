import { Router } from 'express'
import { listOpportunities } from '../controllers/opportunities.controller'

const router = Router()

router.get('/', listOpportunities)

export default router
