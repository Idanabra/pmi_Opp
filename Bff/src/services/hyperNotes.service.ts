import sapClient from '../sapClient'

export async function getHyperNotes(oppId: string): Promise<any[]> {
  const response = await sapClient.get(
    `/sap/c4c/api/v1/opportunity-service/opportunities/${oppId}/hyperNotes`
  )
  const data = response.data
  return Array.isArray(data) ? data : (data.value ?? data.items ?? [])
}
