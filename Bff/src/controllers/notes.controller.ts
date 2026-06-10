import { Request, Response } from 'express'
import { createNote } from '../services/notes.service'

export async function postNote(req: Request, res: Response): Promise<void> {
  const { hostObjectId, hostObjectType, plainContent, htmlContent, noteTypeCode, adminData } = req.body

  if (!hostObjectId || !hostObjectType || !plainContent || !noteTypeCode) {
    res.status(400).json({ error: 'hostObjectId, hostObjectType, plainContent and noteTypeCode are required' })
    return
  }

  try {
    const payload: any = { hostObjectId, hostObjectType, plainContent, htmlContent, noteTypeCode }
    if (adminData) payload.adminData = adminData
    const data = await createNote(payload)
    res.status(201).json(data)
  } catch (err: any) {
    const status = err.response?.status || 500
    res.status(status).json({ error: err.message })
  }
}
