import useApi from '@/api/useApi'
import { defineStore } from 'pinia'

import { URL } from '@/enums'

export const useSectionStore = defineStore('section', {
  state: () => ({
    sections: [],
  }),
  actions: {
    async getSections(id, router) {
      this.sections = await useApi().get(`${URL.SECTIONS}/get_sections/${id}`, router)
    },
  },
})
