import axios from 'axios'

interface ApiPostUser {
  phoneNumber: string
}
export async function apiPostAuthSMS({ phoneNumber }: ApiPostUser) {
  const response = await axios.post('/api/auth/sms', {
    phoneNumber,
  })
  return response.data
}

interface ApiPatchAuthSMS {
  phoneNumber: string
  code: string
}
export async function apiPatchAuthSMS({ phoneNumber, code }: ApiPatchAuthSMS) {
  const response = await axios.patch('/api/auth/sms', {
    phoneNumber,
    code,
  })
  return response.data
}
