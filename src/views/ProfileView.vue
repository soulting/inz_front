<template>
  <div class="profile-view">
    <div class="profile-info-section">
      <h3 class="profile-info__title">Informacje o profilu</h3>
      <div class="profile-container">
        <div class="profile-card">
          <div class="profile-card__avatar">
            <div class="avatar-placeholder">
              <img class="avatar-image" :src="user.profile_image" alt="User Avatar" />
            </div>
          </div>
          <div class="profile-card__info">
            <h4 class="profile-name" v-text="user.name"></h4>
            <p class="profile-email" v-text="user.email"></p>
            <p class="profile-role" v-text="user.role"></p>
            <p class="profile-joined">
              Dołączył:
              {{
                new Date(user.created_at).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="studentProfileLessons && studentProfileTasks" class="account-statistics-section">
      <h3 class="account-statistics__title">Statystyki konta</h3>
      <div class="statistics-container">
        <div class="statistic-card">
          <div class="statistic-card__icon">📚</div>
          <div class="statistic-card__content">
            <h4 class="statistic-card__number" v-text="studentProfileLessons.length"></h4>
            <p class="statistic-card__label">Ukończone lekcje</p>
          </div>
        </div>

        <div class="statistic-card">
          <div class="statistic-card__icon">✅</div>
          <div class="statistic-card__content">
            <h4 class="statistic-card__number" v-text="studentProfileTasks.length"></h4>
            <p class="statistic-card__label">Rozwiązane zadania</p>
          </div>
        </div>

        <div class="statistic-card">
          <div class="statistic-card__icon">⭐</div>
          <div class="statistic-card__content">
            <h4 class="statistic-card__number" v-text="`${avrPoints}%`"></h4>
            <p class="statistic-card__label">Średnia poprawność</p>
          </div>
        </div>

        <div class="statistic-card">
          <div class="statistic-card__icon">🕒</div>
          <div class="statistic-card__content">
            <h4 class="statistic-card__number" v-text="totalLearnTime"></h4>
            <p class="statistic-card__label">Czas nauki</p>
          </div>
        </div>
      </div>
    </div>

    <div class="activity-section">
      <h3 class="activity__title">Ostatnia aktywność</h3>
      <div class="activity-container">
        <div class="activity-column">
          <h4 class="activity-column__title">Lekcje</h4>
          <div
            v-for="(lesson, index) in studentProfileLessons.slice(0, 3)"
            :key="index"
            class="activity-item"
          >
            <ProfileLessonComponent :lesson-analytics="lesson" />
          </div>
        </div>

        <div class="activity-column">
          <h4 class="activity-column__title">Zadania</h4>
          <div
            v-for="(task, index) in studentProfileTasks.slice(0, 3)"
            :key="index"
            class="activity-item"
          >
            <ProfileTaskComponent :task-id="task.task_id" :task-analytics="task" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { computed, onMounted, ref } from 'vue'

import { URL } from '@/enums'

import ProfileLessonComponent from '@/components/ProfileLessonComponent.vue'
import ProfileTaskComponent from '@/components/ProfileTaskComponent.vue'

const router = useRouter()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const studentProfileLessons = ref([])
const studentProfileTasks = ref([])

const profileInfo = ref([])

const avrPoints = computed(() => {
  if (studentProfileTasks.value.length === 0) return 0
  const totalPoints = studentProfileTasks.value.reduce(
    (sum, task) =>
      sum + (task.task_points / (task.task_points + task.task_error + task.task_uncertainty)) * 100,
    0,
  )
  return (totalPoints / studentProfileTasks.value.length).toFixed(2)
})

const totalLearnTime = computed(() => {
  const totalSeconds = studentProfileLessons.value.reduce(
    (sum, lesson) => sum + lesson.time_on_page,
    0,
  )
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours}h ${minutes}m`
})

onMounted(async () => {
  const [studentProfileLessonsResponse, studentProfileTasksResponse] = await Promise.all([
    useApi().get(`${URL.PROFILE}/student_profile_lessons`, router),
    useApi().get(`${URL.PROFILE}/student_profile_tasks`, router),
  ])
  studentProfileLessons.value = studentProfileLessonsResponse
  studentProfileTasks.value = studentProfileTasksResponse
})
</script>

<style scoped>
.profile-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-info-section,
.account-statistics-section,
.activity-section,
.preferences-section {
  margin-bottom: 30px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info__title,
.account-statistics__title,
.activity__title,
.preferences__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-card__avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
}

.profile-card__info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.profile-email,
.profile-role,
.profile-joined {
  margin: 4px 0;
  color: #666;
}

.profile-role {
  font-weight: 500;
  color: #007bff;
}

.statistics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.statistic-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.statistic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.statistic-card__icon {
  font-size: 2rem;
}

.statistic-card__number {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #333;
}

.statistic-card__label {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.activity-container {
  space-y: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.activity-item__icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.activity-item__content {
  flex: 1;
}

.activity-item__title {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.activity-item__time {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.preferences-container {
  display: grid;
  gap: 15px;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.preference-label {
  font-weight: 500;
  color: #333;
}

.preference-value {
  color: #666;
  font-weight: 500;
}

.preference-value.enabled {
  color: #28a745;
}

.preference-value.disabled {
  color: #dc3545;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 10px;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .statistics-container {
    grid-template-columns: 1fr;
  }

  .profile-info-section,
  .account-statistics-section,
  .activity-section,
  .preferences-section {
    padding: 15px;
  }
}
</style>
