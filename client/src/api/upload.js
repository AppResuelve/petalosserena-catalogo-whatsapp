import axios from 'axios'

const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

uploadApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function uploadImage(file, folder = 'productos') {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', folder)
  const { data } = await uploadApi.post('/admin/upload', formData)
  return data
}
