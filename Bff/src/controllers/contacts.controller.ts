import { Request, Response } from 'express'
import { getContacts } from '../services/contacts.service'

export async function listContacts(req: Request, res: Response): Promise<void> {
  const accountId = req.query.accountId as string
  if (!accountId) {
    res.status(400).json({ error: 'accountId query parameter is required' })
    return
  }
  try {
    const data = await getContacts(accountId)
    res.json(data)
  } catch (err: any) {
    const status = err.response?.status || 500
    res.status(status).json({ error: err.message })
  }
}
