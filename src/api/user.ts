import axios from 'axios'

interface ApiPostUser {
  name: string
  phoneNumber: string
}
export async function apiPostUser({ name, phoneNumber }: ApiPostUser) {
  const response = await axios.post('/api/user', {
    name,
    phoneNumber,
  })
  return response.data
}
