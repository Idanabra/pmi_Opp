import { Router } from 'express'
import { accountInfo } from '../controllers/account.controller'

const router = Router()

router.get('/', accountInfo)

export default router
