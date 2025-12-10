<!-- pages/form.vue -->
<template>
  <div class="form-page">
    <FutureForm @complete="startDoor" />
    <BetaDoor ref="door" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FutureForm from '~/components/FutureForm.vue'
import BetaDoor from '~/components/BetaDoor.vue'

const door = ref<InstanceType<typeof BetaDoor> | null>(null)

function startDoor() {
  door.value?.start()
}
</script>

<style scoped>
.form-page {
  min-height: 100vh;
  background: #0B1014;
  position: relative;
  overflow: hidden;
}
</style>
