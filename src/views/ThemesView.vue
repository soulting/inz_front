<template>
  <div v-if="themes.length" class="themes-grid">
    <h1 class="themes-grid__title">Lista tematów</h1>

    <div class="themes-grid__controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Szukaj tematu..."
        class="themes-grid__search-input"
      />
      <div class="tag-filter">
        <button class="tag-filter__button" @click="open = !open">Wybierz tagi</button>

        <div v-if="open" class="tag-filter__dropdown">
          <label v-for="tag in tags" :key="tag" class="tag-option">
            <input type="checkbox" :value="tag" v-model="selectedTags" />
            {{ tag }}
          </label>
        </div>
      </div>

      <select v-model="sortBy" class="themes-grid__sort-select">
        <option value="title">Sortuj: A-Z</option>
        <option value="date">Sortuj: Data</option>
      </select>
    </div>

    <div class="themes-grid__grid">
      <div v-for="(theme, index) in filteredAndSortedThemes" :key="index" class="theme-card">
        <img
          class="theme-card__thumbnail"
          :src="getThumbnailUrl(theme.source)"
          :alt="`Miniaturka dla ${theme.title}`"
        />
        <h2 class="theme-card__title">{{ theme.title }}</h2>
        <p class="theme-card__tag">
          Tag: <span>{{ theme.tag }}</span>
        </p>
        <button class="theme-card__button" @click="redirectToVideo(theme)">Otwórz film</button>
      </div>
    </div>

    <div v-if="!filteredAndSortedThemes.length" class="themes-grid__no-results">
      Brak tematów do wyświetlenia
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useRouter } from 'vue-router'

import { computed, onMounted, ref } from 'vue'

import { URL } from '@/enums'

const router = useRouter()

const themes = ref([])

const searchQuery = ref('')

const sortBy = ref('title')

const tags = ['biology', 'politics', 'technology', 'philosophy']

const selectedTags = ref([])
const open = ref(false)
const filteredAndSortedThemes = computed(() => {
  let result = [...themes.value]

  if (selectedTags.value.length > 0) {
    result = result.filter((theme) => selectedTags.value.includes(theme.tag))
  }

  if (searchQuery.value.trim()) {
    result = result.filter((theme) =>
      theme.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  if (sortBy.value === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return result
})

function redirectToVideo(theme) {
  router.push({ name: 'themen-item', params: { id: theme.id } })
}

const getThumbnailUrl = (source) => {
  const videoId = new DOMParser()
    .parseFromString(source, 'text/html')
    .querySelector('iframe')
    .src.split('/embed/')[1]
    .split('?')[0]
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

onMounted(async () => {
  const themesResponse = await useApi().get(`${URL.THEMES}/themes`, router)
  themes.value = themesResponse
})
</script>

<style scoped lang="scss">
.themes-grid {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    .control-base {
      padding: 0.55rem 1rem;
      font-size: 1rem;
      border-radius: 8px;
      border: 1px solid #ddd;
      background: #f8f8f8;
      color: #111;
      transition: 0.2s ease;
      cursor: pointer;

      &:focus {
        border-color: #2563eb;
      }

      &:hover {
        border-color: #b5b5b5;
      }
    }

    .themes-grid__search-input {
      @extend .control-base;
      width: 60%;
      cursor: text;
    }

    .themes-grid__sort-select {
      @extend .control-base;
      background: white;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    justify-content: center;
    gap: 1rem;
  }

  &__no-results {
    text-align: center;
    font-size: 1rem;
    color: #6b7280;
    margin-top: 1.5rem;
  }
}

.theme-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 300px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__thumbnail {
    width: 100%;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  &__button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    color: #ffffff;
    background-color: #2563eb;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #1e40af;
    }
  }
}

.tag-filter {
  position: relative;
  display: inline-block;

  &__button {
    @extend .control-base;
    color: rgb(0, 0, 0);
    border-color: #444;
  }

  &__dropdown {
    position: absolute;
    top: 40px;
    left: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;

    padding: 10px;
    border-radius: 8px;
    min-width: 180px;
    z-index: 10;

    .tag-option {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      color: rgb(0, 0, 0);

      input {
        accent-color: #2563eb;
      }
    }
  }
}
</style>
