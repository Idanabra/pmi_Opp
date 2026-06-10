import sapClient from '../sapClient'

export async function getCurrentUser(): Promise<any> {
  const response = await sapClient.get('/sap/c4c/api/v1/user-service/users/me')
  return response.data
}
