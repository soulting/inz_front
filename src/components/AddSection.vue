<template>
  <div class="section-form">
    <input
      v-model="sectionTitle"
      type="text"
      placeholder="Tytuł sekcji"
      class="section-form__input"
    />

    <Editor
      v-model="sectionContent"
      api-key="k0efnljtvefg89se78os1oopj0hhvfyohqfko19nnrqo5x7j"
      :init="editorInit"
      class="section-form__editor"
    />
    <button class="section-form__button">ZAPISZ</button>
  </div>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'

import { ref } from 'vue'

// Stany
const sectionTitle = ref('')
const sectionContent = ref('')

// TinyMCE konfiguracja
const editorInit = {
  height: 300,
  menubar: false,
  plugins:
    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount hr fullscreen code preview paste help',
  toolbar:
    'formatselect blocks fontfamily fontsize | bold italic underline strikethrough | link image media table hr | align lineheight | numlist bullist indent outdent | emoticons charmap ',
  branding: false,
  statusbar: false,
}
</script>

<style scoped lang="scss">
.section-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 25px;
  padding: 25px;
  border: solid #aaa 0.5px;
  border-radius: 8px;
  box-shadow: 0 0px 101px 0 rgba(0, 0, 0, 0.05);
}

.section-form__input {
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.section-form__editor {
  border-radius: 8px;
}

.section-form__button {
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #4f46e5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s,
    box-shadow 0.2s;

  &:hover {
    background-color: #4338ca;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.4);
  }
}
</style>
