import sapClient from '../sapClient'

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

export async function createNote(payload: NotePayload): Promise<any> {
  const response = await sapClient.post('/sap/c4c/api/v1/note-service/notes', payload)
  return response.data
}
