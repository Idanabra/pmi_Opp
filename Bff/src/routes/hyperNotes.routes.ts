import { Router } from 'express'
import { listHyperNotes } from '../controllers/hyperNotes.controller'

const router = Router()

router.get('/', listHyperNotes)

export default router
