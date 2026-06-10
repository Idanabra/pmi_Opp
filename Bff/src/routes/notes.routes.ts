import { Router } from 'express'
import { postNote } from '../controllers/notes.controller'

const router = Router()

router.post('/', postNote)

export default router
