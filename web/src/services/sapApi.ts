import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const api = axios.create({ baseURL: BASE })

export function getAccountId(): string {
  const p = new URLSearchParams(window.location.search)
  return (
    p.get('accountId') ||
    p.get('account_id') ||
    p.get('AccountID') ||
    p.get('accountid') ||
    ''
  )
}

// ── Opportunities ────────────────────────────────────────────────────────────
export async function fetchOpportunities(accountId: string): Promise<any[]> {
  const res = await api.get('/api/opportunities', { params: { accountId } })
  return res.data
}

// ── Contacts ─────────────────────────────────────────────────────────────────
export async function fetchContacts(accountId: string): Promise<any[]> {
  const res = await api.get('/api/contacts', { params: { accountId } })
  return res.data
}

// ── Account Info ──────────────────────────────────────────────────────────────
export async function fetchAccountInfo(accountId: string): Promise<{ displayId: string; owner: { name: string; id: string } }> {
  const res = await api.get('/api/account-info', { params: { accountId } })
  return res.data
}

// ── Current User ──────────────────────────────────────────────────────────────
export async function fetchCurrentUser(): Promise<any> {
  const res = await api.get('/api/current-user')
  return res.data
}

// ── Hyper Notes ───────────────────────────────────────────────────────────────
export async function fetchHyperNotes(oppId: string): Promise<any[]> {
  const res = await api.get('/api/hyper-notes', { params: { oppId } })
  return res.data
}

// ── Notes ─────────────────────────────────────────────────────────────────────
export interface NotePayload {
  hostObjectId: string
  hostObjectType: string
  plainContent: string
  htmlContent: string
  noteTypeCode: string
  adminData?: {
    createdBy: string
    createdByName: string
    createdOn: string
    updatedBy: string
    updatedByName: string
    updatedOn: string
  }
}

export async function postNote(payload: NotePayload): Promise<any> {
  const res = await api.post('/api/notes', payload)
  return res.data
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export async function postTask(payload: any): Promise<any> {
  const res = await api.post('/api/tasks', payload)
  return res.data
}
