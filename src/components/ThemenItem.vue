<template>
  <div v-if="themen" class="theme-card">
    <div v-if="themen.type === 'video' || themen.type === 'text'" class="theme-card__container">
      <h2 class="theme-card__title">{{ themen.title }}</h2>

      <p class="theme-card__tag">
        Tag: <span class="theme-card__tag-text">{{ themen.tag }}</span>
      </p>

      <div class="theme-card__content" v-html="themen.source"></div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

const router = useRouter()
const themen = ref(null)

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

onMounted(async () => {
  const themesResponse = await useApi().get(`${URL.THEMES}/themes-item/${props.id}`, router)
  themen.value = themesResponse
})
</script>

<style lang="scss" scoped>
.theme-card {
  display: flex;
  justify-content: center;
  margin: 2rem 1rem;

  &__container {
    background-color: #1f1f2f;
    color: #f5f5f5;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    max-width: 1300px;
    width: 100%;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: #fff;
    line-height: 1.2;
  }

  &__tag {
    font-size: 0.9rem;
    color: #ccc;
    margin-bottom: 1.5rem;

    &-text {
      background-color: #33334d;
      color: #fff;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      font-weight: 500;
      margin-left: 0.5rem;
    }
  }

  &__content {
    background-color: #2a2a3d;
    padding: 1.5rem;
    border-radius: 10px;
    line-height: 1.6;
    color: #ddd;
    font-size: 1rem;

    p {
      margin-bottom: 1rem;
    }

    img,
    video {
      max-width: 100%;
      border-radius: 8px;
      margin-top: 1rem;
    }

    iframe {
      width: 100%;
      border-radius: 8px;
      margin-top: 1rem;
    }
  }
}

@media (max-width: 768px) {
  .theme-card__container {
    padding: 1.5rem;
  }

  .theme-card__title {
    font-size: 1.6rem;
  }
}
</style>
