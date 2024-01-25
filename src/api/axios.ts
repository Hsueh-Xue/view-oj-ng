import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  timeout: 5000
})

axiosInstance.interceptors.request.use()

axiosInstance.interceptors.response.use(
  (resp: AxiosResponse) => {
    if (resp.data.code == 0) {
      return resp
    } else {
      ElMessage.error(resp.data.msg)
      return Promise.reject(resp.data.msg)
    }
  },
  (error: Error) => {
    return error
  }
)

export default axiosInstance
