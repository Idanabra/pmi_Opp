import sapClient from '../sapClient'

export async function getAccountInfo(accountId: string): Promise<{ displayId: string; owner: { name: string; id: string } }> {
  const response = await sapClient.get('/sap/c4c/api/v1/account-service/accounts', {
    params: {
      '$filter': `id eq '${accountId}'`,
      '$top': '1'
    }
  })
  const data = response.data
  const acct = (data.value ?? data.items ?? [])[0] ?? data

  return {
    displayId: acct.displayId || acct.externalId || acct.ID || acct.externalID || '',
    owner: {
      name: acct.owner?.displayName || acct.owner?.name || acct.ownerName || acct.ownerDisplayName || '',
      id: acct.owner?.id || acct.ownerId || acct.owner?.employeeId || ''
    }
  }
}
