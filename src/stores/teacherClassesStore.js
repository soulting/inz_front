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
      try {
        const response = await useApi().get(`${URL.CLASSES}/get_teacher_classes`, router)
        this.classes = response
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    },
    async getTasks(router) {
      try {
        const response = await useApi().get(`${URL.TASKS}/get_teacher_tasks`, router)
        this.tasks = response
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    async getLessons(router) {
      try {
        const response = await useApi().get(`${URL.LESSONS}/get_teacher_lessons`, router)
        this.lessons = response
      } catch (error) {
        console.error('Error fetching lessons:', error)
      }
    },
    async deleteClass(id, router) {
      try {
        await useApi().del(`${URL.CLASSES}/delete_teacher_class/${id}`, router)
      } catch (error) {
        console.error('Error deleting class:', error)
      }
    },
    async deleteTask(id, router) {
      try {
        await useApi().del(`${URL.TASKS}/delete_teacher_task/${id}`, router)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    },
    async deleteLesson(id, router) {
      try {
        await useApi().del(`${URL.LESSONS}/delete_teacher_lesson/${id}`, router)
      } catch (error) {
        console.error('Error deleting lesson:', error)
      }
    },
    async createClass(data, router) {
      try {
        const response = await useApi().post(`${URL.CLASSES}/create_teacher_class`, data, router)
        this.classes.push(response)
      } catch (error) {
        console.error('Error creating class:', error)
      }
    },
    async createTask(data, router) {
      try {
        const response = await useApi().post(`${URL.TASKS}/create_teacher_task`, data, router)
        this.tasks.push(response)
      } catch (error) {
        console.error('Error creating task:', error)
      }
    },
    async createLesson(data, router) {
      try {
        const response = await useApi().post(`${URL.LESSONS}/create_teacher_lesson`, data, router)
        this.lessons.push(response)
      } catch (error) {
        console.error('Error creating lesson:', error)
      }
    },
  },
})
