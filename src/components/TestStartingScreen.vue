<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['start'])

const totalSubtasks = computed(() =>
  props.tasks.reduce((acc, task) => acc + (task.subtasks?.length || 0), 0),
)

function startTest() {
  emit('start')
}
</script>

<template>
  <div class="intro-wrapper">
    <div class="intro-container">
      <h1>Test Poziomujący z Języka Niemieckiego</h1>

      <p>
        Test zawiera <strong>{{ tasks.length }}</strong> zadań i około
        <strong>{{ totalSubtasks }}</strong> podpunktów, sprawdzających różne zagadnienia
        gramatyczne.
      </p>

      <p>
        Masz <strong>90 minut</strong>, ale możesz zakończyć wcześniej. <br />
        <strong>Nie można wracać</strong> do poprzednich zadań.
      </p>

      <p>Po każdym zadaniu oceń jego trudność — to tylko informacja, nie wpływa na test.</p>

      <p>
        Jeśli pole powinno być <strong>puste</strong>, wpisz <code>-</code>.<br />
        Jeśli <strong>nie wiesz</strong>, wpisz <code>???</code>.
      </p>

      <button class="start-btn" @click="startTest">Rozpocznij test</button>
    </div>
  </div>
</template>

<style scoped>
.intro-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eef1f7;
  padding: 2rem;
}

.intro-container {
  max-width: 950px;
  width: 100%;
  background-color: #f4f6fa;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  font-family: 'Varela Round', sans-serif;
  text-align: center;
  padding: 3rem;
}

h1 {
  font-size: 2.5rem;
  color: #3b4bdc;
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  color: #333;
}

.start-btn {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  background-color: #3b4bdc;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-btn:hover {
  background-color: #2a3dc3;
}
</style>
