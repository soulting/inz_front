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
      this.classes = await useApi().get(`${URL.CLASSES}/get_teacher_classes`, router)
    },
    async getTasks(router) {
      this.tasks = await useApi().get(`${URL.TASKS}/get_teacher_tasks`, router)
    },
    async getLessons(router) {
      this.lessons = await useApi().get(`${URL.LESSONS}/get_teacher_lessons`, router)
    },
    async deleteClass(id, router) {
      await useApi().del(`${URL.CLASSES}/delete_teacher_class/${id}`, router)
    },
    async deleteTask(id, router) {
      await useApi().del(`${URL.TASKS}/delete_teacher_task/${id}`, router)
    },
    async deleteLesson(id, router) {
      await useApi().del(`${URL.LESSONS}/delete_teacher_lesson/${id}`, router)
    },
    async createClass(data, router) {
      await useApi().post(`${URL.CLASSES}/create_teacher_class`, data, router)
    },
    async createTask(data, router) {
      await useApi().post(`${URL.TASKS}/create_teacher_task`, data, router)
    },
    async createLesson(data, router) {
      await useApi().post(`${URL.LESSONS}/create_teacher_lesson`, data, router)
    },
  },
})
