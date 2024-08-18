<script setup lang="ts">

</script>

<template>
    <!-- <NuxtRouteAnnouncer /> -->  
  <nav>
    <div class="title">{{ $route.name }}</div>
  </nav>

  <main>
    <NuxtPage />
  </main>
</template>

<style>
.title {
  @apply font-bold text-3xl p-2
}

.jdropdown-container {
  @apply bg-base-300 !w-[50px] overflow-clip shadow-lg mx-5 absolute
}

.jdropdown-close:hover {
  @apply bg-orange-50
}

.jdropdown-item:hover {
  @apply bg-orange-50
}
</style>