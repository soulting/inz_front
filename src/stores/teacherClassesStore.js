import useApi from '@/api/useApi'
import { defineStore } from 'pinia'

import { URL } from '@/enums'

export const useTeacherClassStore = defineStore('classes', {
  state: () => ({
    classes: [],
    tasks: [],
    lessons: [],
  }),
  actions: {
    async getClasses(router) {
      this.classes = await useApi().get(`${URL.CLASSES}/teacher_classes`, router)
    },
    async getTasks(router) {
      this.tasks = await useApi().get(`${URL.TASKS}/tasks`, router)
    },
    async getLessons(router) {
      this.lessons = await useApi().get(`${URL.LESSONS}/lessons`, router)
    },
    async deleteClass(id, router) {
      await useApi().del(`${URL.CLASSES}/class/${id}`, router)
    },
    async deleteTask(id, router) {
      await useApi().del(`${URL.TASKS}/task/${id}`, router)
    },
    async deleteLesson(id, router) {
      await useApi().del(`${URL.LESSONS}/lesson/${id}`, router)
    },
    async createClass(data, router) {
      await useApi().post(`${URL.CLASSES}/class`, data, router)
    },
    async createTask(data, router) {
      await useApi().post(`${URL.TASKS}/create_teacher_task`, data, router)
    },
    async createLesson(data, router) {
      await useApi().post(`${URL.LESSONS}/create_teacher_lesson`, data, router)
    },
  },
})
