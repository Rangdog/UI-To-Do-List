<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header class="header">
      <h1>Agile Scrum Board</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
.header {
  background-color: #f3f4f6;
  padding: 1rem;
  text-align: center;
}
</style>
