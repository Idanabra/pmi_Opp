import { Request, Response } from 'express'
import { getOpportunities } from '../services/opportunities.service'

export async function listOpportunities(req: Request, res: Response): Promise<void> {
  const accountId = req.query.accountId as string
  if (!accountId) {
    res.status(400).json({ error: 'accountId query parameter is required' })
    return
  }
  try {
    const data = await getOpportunities(accountId)
    res.json(data)
  } catch (err: any) {
    const status = err.response?.status || 500
    res.status(status).json({ error: err.message })
  }
}
