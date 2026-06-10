import sapClient from '../sapClient'

export async function getContacts(accountId: string): Promise<any[]> {
  let raw: any[] = []

  // Try 1: navigate to the sub-collection directly (OData pattern)
  try {
    const response = await sapClient.get(
      `/sap/c4c/api/v1/account-service/accounts/${accountId}/hasContactPersons`
    )
    const d = response.data
    raw = Array.isArray(d) ? d : (d?.value ?? d?.items ?? [])
  } catch (e1: any) {
    console.warn('[Contacts] sub-nav failed:', e1.message)
  }

  // Try 2: GET /accounts/{id}?$expand=hasContactPersons
  if (!raw.length) {
    try {
      const response = await sapClient.get(
        `/sap/c4c/api/v1/account-service/accounts/${accountId}`,
        { params: { '$expand': 'hasContactPersons' } }
      )
      const d = response.data
      raw = Array.isArray(d?.hasContactPersons)
        ? d.hasContactPersons
        : (d?.hasContactPersons?.value ?? [])
    } catch (e2: any) {
      console.warn('[Contacts] expand failed:', e2.message)
    }
  }

  return raw
    .filter((c: any) => c.contactFormattedName)
    .sort((a: any, b: any) => a.contactFormattedName.localeCompare(b.contactFormattedName))
}
