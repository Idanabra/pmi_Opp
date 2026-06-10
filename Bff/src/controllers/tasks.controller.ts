import { Request, Response } from 'express'
import { createTask } from '../services/tasks.service'

export async function postTask(req: Request, res: Response): Promise<void> {
  const payload = req.body
  if (!payload || !payload.description) {
    res.status(400).json({ error: 'Task body with description is required' })
    return
  }
  try {
    const data = await createTask(payload)
    res.status(201).json(data)
  } catch (err: any) {
    const status = err.response?.status || 500
    res.status(status).json({ error: err.message, details: err.response?.data })
  }
}
