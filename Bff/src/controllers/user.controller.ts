import { Request, Response } from 'express'
import { getCurrentUser } from '../services/user.service'

export async function currentUser(req: Request, res: Response): Promise<void> {
  try {
    const data = await getCurrentUser()
    res.json(data)
  } catch (err: any) {
    const status = err.response?.status || 500
    res.status(status).json({ error: err.message })
  }
}
