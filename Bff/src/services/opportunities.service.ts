import sapClient from '../sapClient'

export async function getOpportunities(accountId: string): Promise<any[]> {
  const response = await sapClient.get('/sap/c4c/api/v1/opportunity-service/opportunities', {
    params: {
      '$filter': `account.id eq '${accountId}'`,
      '$expand': 'hyperNotes',
      '$top': '200',
      '$orderby': 'name asc'
    }
  })
  const data = response.data
  return data.value ?? data.items ?? []
}
