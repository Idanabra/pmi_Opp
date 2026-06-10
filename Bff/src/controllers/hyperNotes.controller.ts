import { Request, Response } from 'express'
import { getHyperNotes } from '../services/hyperNotes.service'

export async function listHyperNotes(req: Request, res: Response): Promise<void> {
  const oppId = req.query.oppId as string
  if (!oppId) {
    res.status(400).json({ error: 'oppId query parameter is required' })
    return
  }
  try {
    const data = await getHyperNotes(oppId)
    res.json(data)
  } catch (err: any) {
    const status = err.response?.status || 500
    res.status(status).json({ error: err.message })
  }
}
