import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'

import { handleApiError } from './apiErrorHandling'

export default function useApi() {
  const loadingStore = useLoadingStore()
  const authStore = useAuthStore()

  const api = axios.create({
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
  })

  const get = async (url, router) => {
    try {
      loadingStore.startLoading()
      const response = await api.get(url)
      return response.data
    } catch (error) {
      handleApiError(error, router)
      throw error
    } finally {
      loadingStore.stopLoading()
    }
  }

  const post = async (url, data, router, options = {}) => {
    try {
      loadingStore.startLoading()

      const config = {
        headers: {
          ...api.defaults.headers,
          ...options.headers,
        },
      }

      Object.keys(config.headers).forEach((key) => {
        if (config.headers[key] === undefined) {
          delete config.headers[key]
        }
      })

      const response = await api.post(url, data, config)
      return response.data
    } catch (error) {
      handleApiError(error, router)
      throw error
    } finally {
      loadingStore.stopLoading()
    }
  }
  const put = async (url, data, router) => {
    try {
      loadingStore.startLoading()
      const response = await api.put(url, data)
      return response.data
    } catch (error) {
      handleApiError(error, router)
      throw error
    } finally {
      loadingStore.stopLoading()
    }
  }
  const del = async (url, router) => {
    try {
      loadingStore.startLoading()
      const response = await api.delete(url)
      return response.data
    } catch (error) {
      handleApiError(error, router)
      throw error
    } finally {
      loadingStore.stopLoading()
    }
  }

  return {
    get,
    post,
    put,
    del,
  }
}
