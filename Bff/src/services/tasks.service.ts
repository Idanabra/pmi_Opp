import sapClient from '../sapClient'

export async function createTask(payload: any): Promise<any> {
  const response = await sapClient.post('/sap/c4c/api/v1/task-service/tasks', payload)
  return response.data
}
