<template>
  <div class="lesson">
    <div class="lesson__content">
      <h2 class="lesson__title">{{ lesson.title }}</h2>
      <div class="lesson__body tinymce-content" v-html="lesson.context"></div>
    </div>

    <div class="lesson__difficulty">
      <p class="lesson__difficulty-label">Jak trudne było to zadanie?</p>
      <div class="lesson__difficulty-buttons">
        <button
          v-for="level in 5"
          :key="level"
          @click="rateDifficulty(level)"
          :class="[
            'lesson__difficulty-button',
            { 'lesson__difficulty-button--active': userActivity.difficulty === level },
          ]"
        >
          {{
            ['😄 Bardzo łatwe', '🙂 Łatwe', '😐 Neutralne', '😕 Trudne', '😫 Bardzo trudne'][
              level - 1
            ]
          }}
        </button>
      </div>
    </div>

    <div class="lesson__end-button-wrapper">
      <button class="lesson__end-button" @click="endLesson">Zakończ lekcję</button>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useRouter } from 'vue-router'

import { onMounted, onUnmounted, ref } from 'vue'

import { URL } from '@/enums'

const router = useRouter()

const props = defineProps({
  classId: String,
  sectionId: String,
  lessonId: String,
})

let interval
const userActivity = ref({
  timeOnPage: 0,
  mouseMoves: 0,
  scrolls: 0,
  keyPresses: 0,
  clicks: 0,
  difficulty: 3,
  scrollDepth: 0,
})

const lesson = ref({
  id: '',
  title: '',
  description: '',
  context: '',
  level: 'A1',
  main_category: '',
  sub_category: '',
  owner_id: '',
  created_at: null,
})

function rateDifficulty(difficulty) {
  userActivity.value.difficulty = difficulty
}

function handleMouseMove() {
  userActivity.value.mouseMoves++
}
function handleScroll() {
  userActivity.value.scrolls++
}
function handleKey() {
  userActivity.value.keyPresses++
}
function handleClick() {
  userActivity.value.clicks++
}

function startTimer() {
  interval = setInterval(() => {
    userActivity.value.timeOnPage++
  }, 1000)
}

function updateScrollDepth() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  const currentDepth = Math.round(((scrollTop + windowHeight) / fullHeight) * 100)

  if (currentDepth > userActivity.value.scrollDepth) {
    userActivity.value.scrollDepth = currentDepth
  }
}

function stopTimer() {
  clearInterval(interval)
}

function startCollectingMetrics() {
  trackUserActivity()
  startTimer()
}

function stopCollectingMetrics() {
  stopTrackingUserActivity()
  stopTimer()
}

function handleScrollWrapper() {
  handleScroll()
  updateScrollDepth()
}

function trackUserActivity() {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('scroll', handleScrollWrapper)
  window.addEventListener('keydown', handleKey)
  window.addEventListener('click', handleClick)
}

function stopTrackingUserActivity() {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('scroll', handleScrollWrapper)
  window.removeEventListener('keydown', handleKey)
  window.removeEventListener('click', handleClick)
}

function endLesson() {
  router.back()
}

async function sendData() {
  await useApi().post(`${URL.ANALYTICS}/save_lesson_analytics`, {
    classId: props.classId,
    sectionId: props.sectionId,
    lessonId: props.lessonId,
    ...userActivity.value,
    ...lesson.value,
  })
}

onMounted(async () => {
  window.scrollTo(0, 0)
  const response = await useApi().get(`${URL.LESSONS}/lesson/${props.lessonId}`)
  lesson.value = response

  if (document.visibilityState === 'visible') {
    startCollectingMetrics()
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startCollectingMetrics()
    } else {
      stopCollectingMetrics()
    }
  })
})

onUnmounted(() => {
  stopCollectingMetrics()
  sendData()
})
</script>
