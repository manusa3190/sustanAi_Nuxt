<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
h1 {
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