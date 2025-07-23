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

  const post = async (url, data, router) => {
    try {
      loadingStore.startLoading()
      const response = await api.post(url, data)
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
