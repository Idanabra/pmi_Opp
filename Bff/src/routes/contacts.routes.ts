import { Router } from 'express'
import { listContacts } from '../controllers/contacts.controller'

const router = Router()

router.get('/', listContacts)

export default router
